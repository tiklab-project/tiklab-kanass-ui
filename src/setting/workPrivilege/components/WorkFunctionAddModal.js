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
    const iconList = [
        {
            iconUrl: "proivilege1.png",
            key: "proivilege1"
        },
        {
            iconUrl: "proivilege2.png",
            key: "proivilege2"
        },
        {
            iconUrl: "proivilege3.png",
            key: "proivilege3"
        },
        {
            iconUrl: "proivilege4.png",
            key: "proivilege4"
        },
        {
            iconUrl: "proivilege5.png",
            key: "proivilege5"
        }
    ]
    const [iconUrl, setIconUrl] = useState("")

    const { findWorkFunctionList, createWorkFunction } = WorkPrivilegeStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [firstWorkFunctionList, setFirstWorkFunctionList] = useState()

    const showModal = () => {
        setVisible(true);
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            console.log(values)
            const params = {
                name: values.name,
                code: values.code,
                parentId: values.parentId
            }
            createWorkFunction(params).then(res => {
                if (res.code === 0) {
                    setVisible(false);
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

    useEffect(() => {
        if(visible){
            findWorkFunctionList({ parentIdIsNull: true }).then(res => {
                if (res.code === 0) {
                    setFirstWorkFunctionList(res.data)
                }
            })
        }
        
    }, [visible])
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

                        <Form.Item
                            label={`挂载节点`}
                            name="parentId"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入分组',
                                },
                            ]}
                        >
                            <Select
                                placeholder="系统"
                                allowClear
                            >
                                {
                                    firstWorkFunctionList && firstWorkFunctionList.map(item => {
                                        return (
                                            <Select.Option value = {item.id}>{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
            </Fragment>

        </>
    );
};

export default WorkFunctionAddModal;