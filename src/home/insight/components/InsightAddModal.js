/*
 * @Descripttion: 仪表盘添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { Input, Modal, Form } from 'antd';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span:24,
    },
};

const InsightAddModal = (props) => {
    const { visible, setVisible, insightStore, setInsightList } = props;
    const { createInsight, findInsightList } = insightStore;
    // 添加表单
    const [form] = Form.useForm();

    /**
     * 创建仪表盘
     */
    const CreatInsight = () => {
        form.validateFields().then((values) => {
            createInsight(values).then(res => {
                if(res.code === 0){
                    setVisible(false)
                    findInsightList().then(res => {
                        if(res.code === 0) {
                            setInsightList(res.data)
                        }
                    })
                }
            })
        })
    }

    /**
     * 关闭弹窗
     */
    const onCancel = () => {
        setVisible(false)
    }

    return (
        <>
            <Modal
                title={"编辑"}
                visible={visible}
                onOk={CreatInsight}
                onCancel={onCancel}
                cancelText="取消"
                okText="确定"
                closable = {false}
                width = {300}
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
                        name="insightName"
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
        </>
    )
}

export default withRouter(inject("insightStore")(observer(InsightAddModal)));