import React, {useState, useEffect} from 'react';
import {Checkbox,Table} from 'antd';
import {EditOutlined} from "@ant-design/icons"
import {Axios} from "thoughtware-core-ui";
import {Btn} from "../../commons";
import './style/index.scss';

const CheckboxGroup = Checkbox.Group;

const WorkFunctionPrivilege = props => {

    const {roleDetail,isBase,type} = props;

    const [isEdit,setIsEdit] = useState(false)

    const [checkBoxData, setCheckBoxData] = useState([]);
    const [checkBoxGroup, setCheckBoxGroup] = useState({});

    const [selectKey,setSelectKey] = useState([])

    const columns = [
        {
            title: '模块',
            key: 'label',
            width:"30%",
            render: (record) => {
                return(
                    <Checkbox
                        disabled={!isEdit}
                        indeterminate={record.indeterminate}
                        onChange={(list) => onCheckAllChange(list,record)}
                        checked={record.checkAll}
                    >{record.label}</Checkbox>
                )
            },
        },
        {
            title: '功能点',
            key: 'name',
            render: (record) => {
                return(
                    <div className='privilege-role-promise'>
                        <CheckboxGroup
                            disabled={!isEdit}
                            options={checkBoxGroup[record.value]}
                            value={record.checkedList}
                            onChange={(list) => onChangeItem(list,record)}
                        />
                    </div>
                )
            },
        },
    ]

    useEffect(() => {
        if (roleDetail?.id) {
            getAllFunction()
        }
    }, [roleDetail?.id]);

    // 获取所有的权限数据
    const getAllFunction = () => {
        let param;
        if(type==='system'){param = {group:roleDetail?.group}}
        else {param = {type:"2"}}
        Axios.post('/function/findFunctionList', param).then(res => {
            if (!res.code) {
                const data = handelNodeConstructorFunction(res.data)
                setCheckBoxData(data.result)
                setCheckBoxGroup(data.resultChild)
                getRoleByPromise(true, data.result, data.resultChild)
            }
        })
    }

    // 临时设置处理数据层级关系的
    const handelNodeConstructorFunction = data => {
        const parents = data.map(item => {
            return !item.parentFunction && {value:item.id, label: item.name}
        }).filter(Boolean)
        const children = data.map(item => {
            return item.parentFunction && item.parentFunction.id && {value:item.id, label: item.name , parent:item.parentFunction.id}
        }).filter(Boolean)

        let result = []
        let resultChild = {}
        parents.forEach(item => {
            const id = item.value;
            const items = children.filter(item => item.parent === id)
            result.push({
                value:item.value,
                label: item.label,
                indeterminate:false,
                checkedList:[],
                checkAll:false,
            })
            resultChild[item.value] = items
        })
        return {result, resultChild}
    }

    // 构造权限数据结构
    const handelData = data => {
        const children = data.filter(item => item.function && item.function.parentFunction).map(item => {
            return {
                parentID: item.function.parentFunction.id,
                id: item.function.id
            }
        });
        // 获取 parentFunction 为null 且踢出 parent 中数据
        const parent = data.filter(item => !item.function.parentFunction).map(item => {
            return item.function.id
        });
        // 构造 {parentId:[存在权限的id，包含父集id]}
        let checkedIdObj = {}
        parent.forEach(parentID => {
            const data = children.map(item => {
                if (item.parentID === parentID) {
                    return item.id
                }
            }).filter(Boolean);
            checkedIdObj[parentID] = [...data, parentID]
        })
        return checkedIdObj
    }

    /**
     * 获取角色的权限
     * @param init 是否是初始话
     * @param data 父数据
     * @param dataGroup 子数据
     */
    const getRoleByPromise = (init=false, data=[], dataGroup={}) => {
        const params = {
            roleId: type==='domain' ? roleDetail.role.id:roleDetail.id
        }
        Axios.post('roleFunction/findRoleFunctionList', params).then(res => {
            if (!res.code) {
                const checkedListObj = handelData(res.data)
                const checkData = init ? data : checkBoxData;
                const checkDataGroup = init ? dataGroup : checkBoxGroup;
                const newCheckBoxData = checkData.map(item => {
                    const checkedList = checkedListObj[item.value] ? checkedListObj[item.value] : [];
                    // 判断是不是单个没有子集
                    const hasChild = checkDataGroup[item.value].length === 0;

                    let isCheckAll = checkedList.length === checkDataGroup[item.value].length + 1 && checkedList.length !==0;
                    let isIndeterminate = isCheckAll ? !isCheckAll : !!checkedList.length && checkedList.length < checkDataGroup[item.value].length +1
                    if (hasChild && checkedList.length === 1) {
                        isCheckAll = true
                        isIndeterminate = false
                    }
                    return {
                        ...item,
                        checkedList:checkedList ,
                        indeterminate: isIndeterminate,
                        // indeterminate: !!checkedList.length && checkedList.length < checkDataGroup[item.value].length,
                        checkAll: isCheckAll
                    }
                })
                setCheckBoxData(newCheckBoxData)
                setSelectKey(res.data.map(item=>item.function.id))
            }
        })
    }

    const onChangeItem = (list,record) => {
        addOrDeleteCheckId(list, record)
    };

    // 判断是是删除或者添加那个id
    const addOrDeleteCheckId = (list,record) => {
        const newCheckBoxData = checkBoxData.map(item=>{
            if(item.value === record.value ){
                if(list.length===0){
                    getSelectKey(record,"delete")
                    return {
                        ...item,
                        checkedList:[],
                        checkAll:false,
                        indeterminate:false
                    }
                }
                if(list.length===checkBoxGroup[record.value].length){
                    getSelectKey(record,"add")
                    return {
                        ...item,
                        checkedList:list,
                        checkAll:true,
                        indeterminate:false
                    }
                }
                if(list.length<checkBoxGroup[record.value].length){
                    getSelectKey(record,"filterAdd",list)
                    return {
                        ...item,
                        checkedList:list,
                        checkAll:false,
                        indeterminate:true
                    }
                }
            }
            return item
        })
        setCheckBoxData(newCheckBoxData)
    }

    const getSelectKey = (record,type,list) =>{
        const checkedList = checkBoxGroup[record.value].map(item=>item.value).filter(Boolean);
        const lists = [...checkedList,record.value]
        let keys
        if(type==='add'){
            keys =  Array.from(new Set([...selectKey,...lists]))
        }
        else if(type==='delete'){
            keys = selectKey.filter(key=>!lists.includes(key))
        }
        else {
            const bb = selectKey.filter(item=>!checkedList.includes(item))
            keys = Array.from(new Set([...bb,...list,record.value]))
        }
        setSelectKey(keys)
    }

    // 勾选全部
    const onCheckAllChange = (list, record) => {
        const hasParentID = selectKey.includes(record.value);
        const newCheckBoxData = checkBoxData.map(item=>{
            if(item.value===record.value){
                getSelectKey(record,hasParentID?"delete":"add")
                if(hasParentID){
                    return {
                        ...item,
                        checkedList:[],
                        checkAll:false,
                        indeterminate:false
                    }
                }
                const checkedList = checkBoxGroup[record.value].map(item=>item.value).filter(Boolean)
                return {
                    ...item,
                    checkedList:checkedList,
                    checkAll:true,
                    indeterminate:false
                }
            }
            return item
        })
        setCheckBoxData(newCheckBoxData)
    };

    const onCancel = () => {
        getRoleByPromise()
        setIsEdit(false)
    }

    /**
     * 保存
     */
    const onOk = () => {
        const params = {
            role: {
                id:  type==='domain' ? roleDetail.role.id:roleDetail.id
            },
            functionList:selectKey
        }
        Axios.post('roleFunction/updateRoleAllFunction', params).then(res => {
            if(res.code===0){getRoleByPromise()}
            setIsEdit(false)
        })
    }

    return(
        <div className="thoughtware_role_promisse">
            {
                isEdit ?
                    <div className="thoughtware_role_promisse_up" >
                        <Btn onClick={onCancel} isMar={true}>取消</Btn>
                        <Btn type={"primary"} onClick={onOk}>保存</Btn>
                    </div>
                    :
                    (isBase || roleDetail.businessType!==2) &&
                    <div className="thoughtware_role_promisse_up">
                        <Btn onClick={()=>setIsEdit(true)} icon={<EditOutlined/>}>编辑</Btn>
                    </div>
            }
            <div className="thoughtware_role_promisse_table">
                <Table
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={checkBoxData}
                    rowKey={r => r.value}
                />
            </div>
            {
                isEdit &&
                <div className="thoughtware_role_promisse_bottom">
                    <Btn onClick={onCancel} isMar={true}>取消</Btn>
                    <Btn type={"primary"} onClick={onOk}>保存</Btn>
                </div>
            }
        </div>
    )
}

export default WorkFunctionPrivilege
