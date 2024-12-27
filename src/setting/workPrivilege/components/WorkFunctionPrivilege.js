/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:48:10
 * @Description: 角色的事项功能权限
 */
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Col, Divider, Row, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import "./WorkFunctionPrivilege.scss";
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';
import { withRouter } from 'react-router';


const WorkFunctionPrivilege = props => {
    const { findAllWorkItemFunction, updateWorkItemRoleAllFunction,updateWorkItemRoleAllFunctionDm,
         findWorkItemRoleFunctionList, findWorkItemRoleFunctionDmList } = WorkPrivilegeStore;
    const [workFunctionIds, setWorkFunctionIds] = useState()
    const projectId = props.match.params.id;
    const [isEdit, setIsEdit] = useState(false);
    let [functionList, setFunctionList] = useState([])
    const [checkList, setCheckList] = useState([])
    const indeterminate = checkList.length > 0 && checkList.length < functionList.length;
    console.log(checkList.length,functionList.length)
    const checkAll = functionList.length === checkList.length;
    const workTypeId = props.match.params.workTypeId;
    const roleId = props.match.params.roleId;

    const onCheckAllChange = (e) => {
        setCheckList(e.target.checked ? workFunctionIds : []);
    };

    const cancel = () => {
        setIsEdit(false)
    }

    const save = () => {
        setIsEdit(false)
        if(projectId){
            const params = {
                functionListId: checkList,
                roleId: roleId,
                workTypeId: workTypeId,
                functionType:'function',
                domainId: projectId
            }
            updateWorkItemRoleAllFunctionDm(params).then(res => {
                if (res.code === 0) {
                    console.log(res.data)
                }
            })
        }else {
            const params = {
                functionListId: checkList,
                roleId: roleId,
                workTypeId: workTypeId,
                functionType:'function'
            }
            updateWorkItemRoleAllFunction(params).then(res => {
                if (res.code === 0) {
                    console.log(res.data)
                }
            })
        }
      
    }

    useEffect(() => {
        findAllWorkItemFunction().then(res => {
            if (res.code === 0) {
                if(projectId){
                    findWorkItemRoleFunctionDmList({ workTypeId: workTypeId, roleId: roleId, functionType: "function" }).then(data => {
                        if (data.code === 0) {
                            const functionList = data.data;
                            setCheckList(functionList.map(item => item.functionId))
                            console.log(functionList)
                            const list = handleWorkFunctionList(res.data, data.data)
                            setFunctionList(list)
                        }
                    })
                }else {
                    findWorkItemRoleFunctionList({ workTypeId: workTypeId, roleId: roleId, functionType: "function" }).then(data => {
                        if (data.code === 0) {
                            const functionList = data.data;
                            setCheckList(functionList.map(item => item.functionId))
                            const list = handleWorkFunctionList(res.data, data.data)
                            setFunctionList(list)
                        }
                    })
                }
                
            }
        })
        return null;
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
                    functionList && functionList.map(item => {
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

export default withRouter(WorkFunctionPrivilege);
