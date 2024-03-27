/*
 * @Descripttion: 版本添加，编辑弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React, { useState } from "react";
import { Modal, Select, Space, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PrivilegeProjectButton } from "thoughtware-privilege-ui";
import Button from "../../../common/button/Button";
const { RangePicker } = DatePicker;
const VersionAddmodal = (props) => {
    const { versionStore, findVersion, userList, getUseList, setActiveTabs, selectTabs } = props;
    const { editVersion, addVersion, searchVersionById, status, findAllVersionState, 
        getVersionList, searchCondition } = versionStore;
    const [form] = Form.useForm();
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 项目id
    const projectId = props.match.params.id;
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };


    /**
     * 表单提交，编辑或者添加版本
     */
    const submitVersion = () => {
        form.validateFields().then((fieldsValue) => {
            const time = fieldsValue["startTime"]
            const values = {
                ...fieldsValue,
                master: {
                    id: fieldsValue.master
                },
                versionState: {
                    id: fieldsValue.versionState
                },
                project: {
                    id: projectId
                },
                startTime: time[0].format(dateFormat),
                publishTime: time[1].format(dateFormat),
                // 'publishTime': fieldsValue['publishTime'].format(dateFormat),
                // 'startTime': fieldsValue['startTime'].format(dateFormat)
            };
            if (props.type === "edit") {
                values.id = props.id
                editVersion(values).then(() => {
                    form.resetFields();
                    setVisible(false);
                })
            } else {
                addVersion(values).then((res) => {
                    if(res.code === 0){
                        setActiveTabs("all")
                        selectTabs("all", 1)
                    }
                    setVisible(false);
                    form.resetFields();
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
        getUseList(projectId)
        setVisible(true);
        findAllVersionState().then(res => {
            if (res.code === 0) {
                form.setFieldsValue({
                    versionState: res?.data[0]?.id
                })
            }
        })
        if (props.type === "edit") {
            searchVersionById({ id: props.id }).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    project: res.project.id,
                    // publishTime: res.publishTime ? moment(res.publishTime) : null,
                    startTime: res.data.startTime ? [moment(res.data.startTime, dateFormat), moment(res.data.publishTime, dateFormat)] : null,
                    versionState: res.versionState
                })
            })
        }
    };



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
                        <svg className="svg-icon" aria-hidden="true" onClick={showModal} style={{ cursor: "pointer" }}>
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
                            label="负责人"
                            name="master"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入负责人',
                                },
                            ]}
                        >
                            <Select
                                placeholder="负责人"
                                allowClear
                            >
                                {
                                    userList && userList.map((item, index) => {
                                        return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="startTime" label="计划日期"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择计划日期',
                                },
                            ]}>
                            <RangePicker
                                locale={locale}
                                showTime={{
                                    defaultValue: [moment('09:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss')]
                                }}
                            />
                        </Form.Item>
                        {/* <Form.Item
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
                                format={dateFormat}
                                locale={locale}
                                
                                showTime
                            />
                        </Form.Item>

                        <Form.Item
                            label="发布日期"
                            name="publishTime"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择发布日期',
                                }
                            ]}
                        >
                            <DatePicker
                                format={dateFormat}
                                locale={locale}
                                showTime
                            />
                        </Form.Item> */}
                    </Form>
                </Modal>
            </div>

        </>
    );
};
export default inject("versionStore")(observer(VersionAddmodal));