import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Divider, Row } from 'antd';
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';
import "./WorkFieldPrivilege.scss";
import { EditOutlined } from "@ant-design/icons";
import { withRouter } from 'react-router';
const WorkFieldPrivilege = (props) => {
    const { formId } = props;
    const [isEdit, setIsEdit] = useState(false);
    const { findFormFieldList, updateWorkItemRoleAllFunction, findWorkItemRoleFunctionList,
        findWorkItemRoleFunctionDmList, updateWorkItemRoleAllFunctionDm
    } = WorkPrivilegeStore;
    const projectId = props.match.params.id;
    const [fieldIdList, setFieldIdList] = useState()
    const [fieldOptionList, setFieldOptionList] = useState([])
    const [checkedList, setCheckedList] = useState([]);
    const checkAll = fieldOptionList.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fieldOptionList.length;
    const roleId = props.match.params.roleId;
    const workTypeId = props.match.params.workTypeId;

    useEffect(() => {
        findFormFieldList({ formId: formId }).then(form => {
            if (form.code === 0) {
                const fieldList = form.data;
                if (projectId) {
                    findWorkItemRoleFunctionDmList({ workTypeId: workTypeId, roleId: roleId, functionType: "field" }).then(data => {
                        if (data.code === 0) {
                            const list = handleWorkFunctionList(fieldList, data.data);
                            setFieldOptionList(list);
                        }
                    })
                } else {
                    findWorkItemRoleFunctionList({ workTypeId: workTypeId, roleId: roleId, functionType: "field" }).then(data => {
                        if (data.code === 0) {
                            const list = handleWorkFunctionList(fieldList, data.data);
                            setFieldOptionList(list)
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
                value: item.field.id,
                label: item.field.name,
                code: item.code,
                indeterminate: false,
                checked: false
            }
            const cheackRoleFunctionList = roleFunctionList.filter(roleFunction => roleFunction.functionId === item.field.id)
            console.log(cheackRoleFunctionList, "ssss")
            if (cheackRoleFunctionList.length > 0) {
                checkedList.push(cheackRoleFunctionList[0].functionId)
                params.checked = true
            }

            list.push(params)
            ids.push(item.field.id)
        })
        setCheckedList(checkedList)
        setFieldIdList(ids)
        return list;
    }

    const onChange = (list) => {
        setCheckedList(list);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? fieldIdList : []);
    };

    const cancel = () => {
        setIsEdit(false)
    }

    const save = () => {
        setIsEdit(false);
        const params = {
            functionListId: checkedList,
            roleId: roleId,
            workTypeId: workTypeId,
            functionType: 'field'
        }
        if (projectId) {
            params.domainId = projectId;
            updateWorkItemRoleAllFunctionDm(params).then(res => {
                if (res.code === 0) {
                    console.log(res.data)
                }
            })
        } else {
            updateWorkItemRoleAllFunction(params).then(res => {
                if (res.code === 0) {
                    console.log(res.data)
                }
            })
        }
    }

    return (
        <div className="work-field-privilege">
            <div className="work-field-top">
                <Checkbox disabled={!isEdit} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
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
                style={{
                    width: '100%',
                }}
                onChange={onChange}
                value={checkedList}
                disabled={!isEdit}
            >

                <Row>
                    {
                        fieldOptionList && fieldOptionList.map(item => {
                            return (
                                <Col span={4} key={item.value}>
                                    <Checkbox option={item.value} value={item.value}>{item.label}</Checkbox>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Checkbox.Group>
        </div>
    );
};

export default withRouter(WorkFieldPrivilege);

