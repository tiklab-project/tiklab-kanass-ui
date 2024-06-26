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


const WorkPrivilegeAddModal = (props) => {
    const {getList} = props;
    const { createWorkPrivilege } = WorkPrivilegeStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            console.log(values)
            const params = {
                name: values.name,
                grouper: "system",
                scope: "1"
            }
            createWorkPrivilege(params).then(res => {
                if (res.code === 0) {
                    setVisible(false);
                    getList()
                    form.resetFields()
                }
            })
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
                        添加权限方案
                    </Button> : <svg className="svg-icon" aria-hidden="true" onClick={() => showModal()} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                }
                <Modal
                    title="添加权限方案"
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
                            label={`方案名称`}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入方案名称',
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

export default WorkPrivilegeAddModal;