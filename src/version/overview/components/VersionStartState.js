/*
 * @Descripttion: 版本转换到开始状态的页面弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:08:14
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Select, Modal, message, Form, Input, DatePicker } from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
const { RangePicker } = DatePicker;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 24,
    },
};

const VersionStartState = props => {
    const {  versionId, visible, setVisible, VersionSurveyStore, versionInfo, setVersionInfo } = props;
    const { updateVersion, findVersion } = VersionSurveyStore;
    const [form] = Form.useForm();
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                name: versionInfo?.name,
                desc: versionInfo?.desc || null,
                startTime: versionInfo.startTime ? [moment(versionInfo.startTime, dateFormat), moment(versionInfo.publishTime, dateFormat)] : null
            })
        }

        return null;
    }, [visible])

    const handleOk = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format(dateFormat),
                publishTime: time[1].format(dateFormat),
                desc: values.desc,
                versionState: {
                    id: "111111"
                },
                id: versionId
            }
            updateVersion(data).then(res => {
                if (res.code === 0) {
                    findVersion({ versionId: versionId }).then(res => {
                        setVersionInfo(res.data)
                    })
                    message.success("修改成功");
                    setVisible(false)
                }
            });
        })
    }
    return (
        <Modal
            title="开始版本"
            getContainer={false}
            visible={visible}
            closable={false}
            onOk={() => handleOk()}
            onCancel={() => setVisible(false)}
            okText={"确定"}
            cancelText={"取消"}
            okButtonProps={{ type: "primary" }}
        >
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
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
                    <Input placeholder="版本名称" />
                </Form.Item>

                <Form.Item name="startTime" label="计划日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择计划日期',
                        },
                    ]}>
                    <RangePicker locale={locale} showTime/>
                </Form.Item>
                <Form.Item
                    label="版本描述"
                    name="desc"
                    rules={[
                        {
                            required: false,
                            message: '请输入版本描述',
                        },
                    ]}
                >
                    <Input placeholder="版本描述" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default observer(VersionStartState);
