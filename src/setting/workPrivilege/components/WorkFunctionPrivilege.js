import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Col, Divider, Row, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import "./WorkFunctionPrivilege.scss";
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';

const CheckboxGroup = Checkbox.Group;

const WorkFunctionPrivilege = props => {
    const { workTypeId, roleType, privilegeId, projectId } = props;
    const { findAllWorkItemFunction, updateWorkRoleAllFunction, findWorkItemRoleFunctionList } = WorkPrivilegeStore;
    const [workFunctionIds, setWorkFunctionIds] = useState()

    const [isEdit, setIsEdit] = useState(false);
    let [checkBoxData, setCheckBoxData] = useState([])
    const [checkList, setCheckList] = useState([])
    const indeterminate = checkList.length > 0 && checkList.length < checkBoxData.length;
    const checkAll = checkBoxData.length === checkList.length;

    const onCheckAllChange = (e) => {
        setCheckList(e.target.checked ? workFunctionIds : []);
    };




    const cancel = () => {
        setIsEdit(false)
    }

    const save = () => {
        console.log(checkList)
        const params = {
            functionList: checkList,
        }
        // updateWorkRoleAllFunction(params).then(res => {
        //     if (res.code === 0) {
        //         console.log(res.data)
        //     }
        // })
    }



    useEffect(() => {
        findAllWorkItemFunction().then(res => {
            if (res.code === 0) {

                findWorkItemRoleFunctionList({ workTypeId: workTypeId }).then(data => {
                    if (data.code === 0) {
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
        let ids = [];
        functionList.map(item => {

            const params = {
                value: item.id,
                label: item.name,
                code: item.code,
                indeterminate: false,
                checked: false,
            }
            const cheackRoleFunctionList = roleFunctionList.filter(roleFunction => roleFunction.functionId === item.id)
            if (cheackRoleFunctionList.length > 0) {
                params.checked = true
            }

            list.push(params)
            ids.push(item.id)
        })
        setWorkFunctionIds(ids)
        return list;
    }

    const onChange = (list) => {
        setCheckList(list);
    };

    return (
        <div className="work-function-privilege">
        
            <div className="work-function-top">
                <Checkbox disabled={!isEdit}  indeterminate={indeterminate} onChange= {onCheckAllChange} checked={checkAll}>
                    全选
                </Checkbox>
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

            </div>

            <Divider />
            <Checkbox.Group
                disabled={!isEdit}
                value={checkList}
                onChange={onChange}
                style={{
                    width: '100%',
                }}
            >
            <Row>
                {
                    checkBoxData && checkBoxData.map(item => {
                        return (
                            <Col span={4} key={item.value}>
                                <Checkbox option={item.value} value={item.value}>{item.label}</Checkbox>
                            </Col>
                        )
                    })
                }
            </Row>
        </Checkbox.Group>
        </div >
    )
}

export default WorkFunctionPrivilege
