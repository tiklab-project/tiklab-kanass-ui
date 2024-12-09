import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Divider, Row } from 'antd';
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';
import "./WorkFieldPrivilege.scss";
import { EditOutlined } from "@ant-design/icons";
const WorkFieldPrivilege = (props) => {
    const { formId, privilegeId, roleType, roleId } = props;
    console.log(formId, "sss")
    const [isEdit, setIsEdit] = useState(false);
    const { findFormFieldList, findWorkType, updateWorkRoleAllFunction, findWorkRoleFunctionList } = WorkPrivilegeStore;

    const [fieldIdList, setFieldIdList] = useState()
    const [fieldOptionList, setFieldOptionList] = useState([])
    const [checkedList, setCheckedList] = useState([]);
    const checkAll = fieldOptionList.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fieldOptionList.length;

    useEffect(() => {
        findFormFieldList({ formId: formId }).then(form => {
            if (form.code === 0) {
                console.log(form)
                const fieldList = form.data;
                const list = [];
                const ids = [];
                fieldList.map(item => {
                    const option = {
                        value: item.field.id,
                        label: item.field.name,
                        code: item.field.code,
                        checked: false
                    }
                    list.push(option)
                    ids.push(item.field.id)
                })

                setFieldIdList(ids)
                setFieldOptionList(list)
            }
        })

        return
    }, [])

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
        console.log(checkedList)
        setIsEdit(true);
        const params = {
            roleId: roleId,
            roleType: roleType,
            privilegeId: privilegeId,
            functionList: checkedList,
            functionType: "field",
            type: "system"
        }
        updateWorkRoleAllFunction(params).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }
        })
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
            // options = {fieldOptionList}
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
            {/* <CheckboxGroup options={fieldOptionList} value={checkedList} onChange={onChange} /> */}
        </div>
    );
};

export default WorkFieldPrivilege;

