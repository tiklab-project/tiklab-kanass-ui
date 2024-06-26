import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Divider, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import "./WorkFunctionPrivilege.scss";
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';

const CheckboxGroup = Checkbox.Group;

const WorkFunctionPrivilege = props => {
    const {roleId, roleType, privilegeId, projectId} = props;
    const {findWorkFunctionTreeList, updateWorkRoleAllFunction, findWorkRoleFunctionList} = WorkPrivilegeStore;
    const [workFunctionList, setWorkFunctionList] = useState()
    
    const [isEdit, setIsEdit] = useState(false);
    let [checkBoxData, setCheckBoxData] = useState([])
    const [checkList, setCheckList] = useState([])
    const onCheckAllChange = (e, record, index) => {
        console.log(index)
        const checked = e.target.checked;
        const list = [];
        
        if(record.childrenData?.length > 0){
            record.childrenData.map(item => {
                list.push(item.value)
            })
        }
        
        if(checked){
            checkBoxData[index].checkedList = list;
            checkBoxData[index].indeterminate = false;

            checkList.push(record.value)
            checkList.push(...list)
            setCheckList(checkList)
            
        }else {
            checkBoxData[index].checkedList = [];
            checkBoxData[index].indeterminate = false;

            list.push(record.value)
            const list1 =  checkList.filter(item => list.indexOf(item) < 0);
            setCheckList([...list1])
        }
        checkBoxData[index].checked = checked;
        setCheckBoxData([...checkBoxData])
    };
    
    const onChangeItem = (list, record, index) => {
        addOrDeleteCheckId(list, record)

        checkBoxData[index].checkedList = list;
        const childrenNum = checkBoxData[index].childrenData?.length;
        if(list.length > 0  &&  list.length < childrenNum){
            checkBoxData[index].indeterminate = true;
            checkBoxData[index].checked = false;
        }
        if(list.length > 0  &&  list.length === childrenNum){
            checkBoxData[index].indeterminate = false;
            checkBoxData[index].checked = true;
        }
        if(list.length === 0){
            checkBoxData[index].indeterminate = false;
            checkBoxData[index].checked = false;
        }
        setCheckBoxData([...checkBoxData])
        console.log(checkList)
    }

    const addOrDeleteCheckId = (list, record) => {
        const checkedList = record.checkedList;
        if(list.length > checkedList.length){
            // 选中
            const checkedId = list.filter(item => checkedList.indexOf(item) < 0);
            checkList.push(...checkedId)
            setCheckList(checkList)
            if(list.length === record.childrenData?.length){
                checkList.push(record.value)
                setCheckList(checkList)
            }
        }else{

            // 取消选中
            console.log(checkedList.filter(id => list.indexOf(id) < 0))
            const checkedIds = checkedList.filter(id => list.indexOf(id) < 0);
            if(checkedList.length === record.childrenData?.length){
                checkedIds.push(record.value)
            }
            const list1 = checkList.filter(id => checkedIds.indexOf(id) < 0);
            setCheckList(list1)
        }
    }

    const cancel = () => {
        setIsEdit(false)
    }

    const save = () => {
        const params = {
            roleId: roleId,
            roleType: roleType,
            privilegeId: privilegeId,
            functionList: checkList,
            functionType: "function",
            type: "system",
            projectId: projectId
        }
        updateWorkRoleAllFunction(params).then(res => {
            if(res.code === 0){
                console.log(res.data)
            }
        })
    }

    const columns = [
        {
            title: '模块',
            key: 'label',
            width: "30%",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        disabled={!isEdit}
                        indeterminate={record.indeterminate}
                        onChange={(e) => onCheckAllChange(e, record, index)}
                        checked={record.checked}
                    >   
                        {record.label}
                    </Checkbox>
                )
            },
        },
        {
            title: '功能点',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <div className='privilege-role-promise'>
                        <CheckboxGroup
                            disabled={!isEdit}
                            options={record.childrenData}
                            value={record.checkedList}
                            onChange={(list) => onChangeItem(list, record, index)}
                        />
                    </div>
                )
            },
        },
    ]

    useEffect(()=> {
        findWorkFunctionTreeList({}).then(res => {
            if(res.code === 0){
                setWorkFunctionList(res.data)
                findWorkRoleFunctionList({roleId: roleId, functionType: "function", privilegeId: privilegeId}).then(data => {
                    if(data.code === 0){
                        const functionList = data.data;
                        setCheckList(functionList.map(item => item.functionId))
                        const list = handleWorkFunctionList(res.data, data.data)
                        setCheckBoxData(list)
                    }
                })
            }
        })
    }, [])

    const handleWorkFunctionList = (functionList, roleFunctionList) => {
        let list = [];
        functionList.map(item => {
            
            const params = {
                value: item.id,
                label: item.name,
                code: item.code,
                indeterminate: false,
                checkedList: [],
                checked: false,
            }
            const cheackRoleFunctionList = roleFunctionList.filter(roleFunction => roleFunction.functionId === item.id )
            if(cheackRoleFunctionList.length > 0){
                params.checked = true
            }
            if(item.children?.length > 0){
               const list1 =  handleWorkFunctionList(item.children, roleFunctionList)
               params.childrenData = list1;
               if(list1.length > 0){
                    const list2 = list1.map(item => item.value)
                    const childrenRoleFunction = roleFunctionList.filter(item => list2.indexOf(item.functionId) > -1);
                    console.log(childrenRoleFunction)
                    params.checkedList = childrenRoleFunction.map(item => item.functionId)
               }
               
            }
            list.push(params)
        })
        return list;
    }

    return (
        <div className="work-function-privilege">
            {
                isEdit ?
                    <div className="work-function-promisse" >
                        <Button onClick={() => cancel()} isMar={true}>取消</Button>
                        <Button type={"primary"} onClick={() => save()}>保存</Button>
                    </div>
                    :
                    // (isBase || roleDetail.businessType !== 2) &&
                    <div className="work-function-promisse">
                        <Button onClick={() => setIsEdit(true)} icon={<EditOutlined />}>编辑</Button>
                    </div>
            }
            <div className="work-function-promisse-table">
                <Table
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={checkBoxData}
                    rowKey={r => r.value}
                />
            </div>
        </div>
    )
}

export default WorkFunctionPrivilege
