/*
 * @Descripttion: 版本添加，编辑弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React from "react";
import { Modal, Select, Space, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import Button from "../../../common/button/Button";

const VersionAddmodal = (props) => {
    const { versionStore, findVersion } = props;
    const { editVersion, addVersion, searchVersionById } = versionStore;
    const [form] = Form.useForm();
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 项目id
    const projectId = props.match.params.id;
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };


    /**
     * 表单提交，编辑或者添加版本
     */
    const submitVersion = () => {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                project: projectId,
                'publishDate': fieldsValue['publishDate'].format('YYYY-MM-DD'),
                'startTime': fieldsValue['startTime'].format('YYYY-MM-DD')
            };
            if (props.type === "edit") {
                values.id = props.id
                editVersion(values).then(() => {
                    setVisible(false);
                })
            } else {
                addVersion(values).then(() => {
                    findVersion({ projectId: projectId })
                    setVisible(false);
                })
            }
        })

    }

    /**
     * 重置表单
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    }

    /**
     * 显示编辑弹窗，若是编辑模式，初始化表单
     */
    const showModal = () => {
        setVisible(true);
        if (props.type === "edit") {
            searchVersionById({ id: props.id }).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    project: res.project.id,
                    publishDate: res.publishDate ? moment(res.publishDate) : null,
                    startTime: res.startTime ? moment(res.startTime) : null,
                    versionState: res.versionState
                })
            })
        }
    };

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "0"
        },
        {
            name: "进行中",
            id: "1"
        },
        {
            name: "已发布",
            id: "2"
        }
    ]

    return (
        <>
            <div className="addmodel">
                {props.type !== "edit" ?
                    <PrivilegeProjectButton code={'VersionAdd'} domainId={projectId}  {...props}>
                        <Button onClick={showModal} type="primary" >
                            添加版本
                        </Button>
                    </PrivilegeProjectButton>
                    :
                    <PrivilegeProjectButton code={'VersionEdit'} domainId={projectId}  {...props}>
                        {/* <Button onClick={showModal} style={{ color: "var(--tiklab-gray-400)" }} type="dashed">
                            {props.name}
                        </Button> */}
                         <svg className="svg-icon" aria-hidden="true" onClick={showModal} style = {{cursor: "pointer"}}>
                            <use xlinkHref="#icon-edit"></use>
                        </svg>

                    </PrivilegeProjectButton>

                }
                <Modal
                    title={props.name}
                    visible={visible}
                    width={520}
                    onOk={submitVersion}
                    onCancel={onFinishFailed}
                    cancelText="取消"
                    okText="确定"
                    closable={false}
                >
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            project: projectId
                        }}
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label="版本名称"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入版本名称',
                                },
                            ]}
                        >
                            <Input placeholder="请输入版本名称" />
                        </Form.Item>

                        <Form.Item
                            label="版本状态"
                            name="versionState"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择版本状态',
                                },
                            ]}
                        >
                            <Select
                                placeholder="版本状态"
                                allowClear
                            >
                                {
                                    status && status.map((item, index) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="起始时间"
                            name="startTime"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择起始日期',
                                }
                            ]}
                        >   
                            <DatePicker
                                format="YYYY-MM-DD"
                                locale={locale}
                            />
                        </Form.Item>

                        <Form.Item
                            label="发布日期"
                            name="publishDate"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择发布日期',
                                }
                            ]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                locale={locale}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        </>
    );
};
export default inject("versionStore")(observer(VersionAddmodal));