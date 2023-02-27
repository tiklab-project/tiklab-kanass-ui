/*
 * @Descripttion: 统计报表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-02-25 10:24:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 20:07:35
 */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const ReportAddOrEdit = (props) => {
    const [form] = Form.useForm();
    const projectId =  JSON.parse(localStorage.getItem("project"))?.id;
    const { setVisible, visible, fromData, statisticsStore, reportType,type } = props;
    const { createReport, findReportList, findReport, reportId, updateReport } = statisticsStore;
    const showModal = () => {
        if (props.type === "edit") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0) {
                    form.setFieldsValue({
                        title: data.data.title
                    })
                }
            })
        }
    };

    useEffect(() => {
        if (visible) {
            showModal()
        }
        return;
    }, [visible])

    const onFinish = () => {
        form.validateFields().then((values) => {
            values.type = type;
            if (props.type === "edit") {
                values.id = reportId;
                updateReport(values).then(data => {
                    if (data.code === 0) {
                        findReportList({ projectId: projectId })
                        setVisible(false);
                    }
                })
            } else {
                values.reportData = JSON.stringify(fromData)
                console.log(JSON.stringify(fromData))
                values.reportType = reportType;
                values.projectId = projectId;
                createReport(values).then(data => {
                    if (data.code === 0) {
                        findReportList({ projectId: projectId, type: type })
                        setVisible(false);
                    }
                })
            }
        })
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);

    };

    return (
        <Modal
            title={"编辑"}
            visible={visible}
            onOk={onFinish}
            onCancel={onCancel}
            cancelText="取消"
            okText="确定"
            closable = {false}
        >
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                form={form}
                layout = "vertical"
            >
                <Form.Item
                    label="报表名称"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '请输入报表名称',
                        },
                    ]}
                >
                    <Input placeholder="报表名称" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default inject("statisticsStore")(observer(ReportAddOrEdit));