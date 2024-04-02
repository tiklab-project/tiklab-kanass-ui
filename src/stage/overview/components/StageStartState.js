/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
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

const StageStartState = props => {
    const { projectId, stageId, visible, setVisible, StageSurveyStore, stageInfo, setStageInfo } = props;
    const { updateStage, findStage } = StageSurveyStore;
    const [form] = Form.useForm();
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                stageName: stageInfo?.stageName,
                desc: stageInfo?.desc || null,
                startTime: stageInfo.startTime ? [moment(stageInfo.startTime, dateFormat), moment(stageInfo.endTime, dateFormat)] : null
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
                endTime: time[1].format(dateFormat),
                desc: values.desc,
                stageState: {
                    id: "111111"
                },
                id: stageId
            }
            updateStage(data).then(res => {
                if (res.code === 0) {
                    findStage({ stageId: stageId }).then(res => {
                        setStageInfo(res.data)
                    })
                    message.success("修改成功");
                    setVisible(false)
                }
            });
        })
    }
    return (
        <Modal
            title="开始迭代"
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
                    label="迭代名称"
                    name="stageName"
                    rules={[
                        {
                            required: true,
                            message: '请输入迭代名称',
                        },
                    ]}
                >
                    <Input placeholder="迭代名称" />
                </Form.Item>

                <Form.Item name="startTime" label="计划日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择计划日期',
                        },
                    ]}>
                    <RangePicker locale={locale} showTime />
                </Form.Item>
                <Form.Item
                    label="迭代描述"
                    name="desc"
                    rules={[
                        {
                            required: false,
                            message: '请输入迭代描述',
                        },
                    ]}
                >
                    <Input placeholder="迭代描述" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default observer(StageStartState);
