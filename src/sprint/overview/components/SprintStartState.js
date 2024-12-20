/*
 * @Descripttion: 迭代转为开始状态的弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 15:30:35
 */
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Modal, message, Form, Input, DatePicker } from "antd";
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

const SprintStartState = props => {
    const { projectId, sprintId, visible, setVisible, SprintSurveyStore, sprintInfo, setSprintInfo } = props;
    const { updateSprint, findSprint } = SprintSurveyStore;
    const [form] = Form.useForm();
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                sprintName: sprintInfo?.sprintName,
                desc: sprintInfo?.desc || null,
                startTime: sprintInfo.startTime ? [moment(sprintInfo.startTime, dateFormat), moment(sprintInfo.endTime, dateFormat)] : null
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
                sprintState: {
                    id: "111111"
                },
                id: sprintId
            }
            updateSprint(data).then(res => {
                if (res.code === 0) {
                    findSprint({ sprintId: sprintId }).then(res => {
                        setSprintInfo(res.data)
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
                    name="sprintName"
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

export default observer(SprintStartState);
