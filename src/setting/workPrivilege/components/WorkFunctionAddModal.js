/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:36:43
 * @Description: 事项功能权限添加弹窗
 */
import React, { Fragment, useEffect, useState } from "react";
import { Modal, Form, Input, Radio, Select } from 'antd';
import Button from "../../../common/button/Button";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
};

const WorkFunctionAddModal = (props) => {
    const {setDataSource, type, id} = props;
    const [functionInfo, setFunctionInfo] = useState()

    const { findAllWorkItemFunction, createWorkItemFunction, findWorkItemFunction, updateWorkItemFunction } = WorkPrivilegeStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    useEffect(()=> {
        if(visible && type === "edit"){
            findWorkItemFunction({id: id}).then(res => {
                if(res.code === 0){
                    setFunctionInfo(res.data)
                    const data = res.data;
                    form.setFieldsValue({
                        name: data.name,
                        code: data.code
                    })
                }
            })
        }
        return
    }, [visible])

    const showModal = () => {
        setVisible(true);
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            console.log(values)
            // const params = {
            //     name: values.name,
            //     code: values.code
            // }
            if(type === "edit"){
                const params = {
                    id: id,
                    name: values.name,
                    code: values.code
                }
                updateWorkItemFunction(params).then(res => {
                    if (res.code === 0) {
                        setVisible(false);
                        findAllWorkItemFunction().then(res => {
                            if (res.code === 0) {
                                setDataSource(res.data)
                            }
                        })
                        form.resetFields()
                    }
                })
            }else {
                createWorkItemFunction(values).then(res => {
                    if (res.code === 0) {
                        setVisible(false);
                        findAllWorkItemFunction().then(res => {
                            if (res.code === 0) {
                                setDataSource(res.data)
                            }
                        })
                        form.resetFields()
                    }
                })
            }
           
            // setVisible(false);
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };



    return (
        <>
            <Fragment>
                {
                    props.type !== "edit" ? <Button type="primary" onClick={showModal}>
                        添加功能
                    </Button> : <svg className="svg-icon" aria-hidden="true" onClick={() => showModal()} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                }
                <Modal
                    title="添加功能"
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onFinish}
                    closable={false}
                >
                    <Form
                        {...layout}
                        name="basic"

                        form={form}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label={`功能名称`}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入功能名称',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={`功能编码`}
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入功能编码',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                      

                    </Form>
                </Modal>
            </Fragment>

        </>
    );
};

export default WorkFunctionAddModal;