import React, { useState, useCallback } from 'react';
import { observer, inject } from "mobx-react";
import { Form, Modal, Button, Input, DatePicker, Select, Radio, message } from 'antd';
import moment from "moment";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import testPlanStore from "../store/testPlanStore";

const { RangePicker } = DatePicker;
const { Option } = Select;




// 添加与编辑测试计划组件
const TestPlanEdit = (props) => {
    const { testPlanId, findPage } = props;
    const { findTestPlan, createTestPlan, updateTestPlan } = testPlanStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const projectId = localStorage.getItem('projectId');

    // 弹框展示
    const showModal = useCallback(async () => {
        if (props.type === "edit") {
            try {
                setLoading(true);
                const res = await findTestPlan(testPlanId);
                form.setFieldsValue({
                    name: res.name,
                    state: res.state,
                    rangeTime: [moment(res.startTime, 'YYYY-MM-DD'), moment(res.endTime, 'YYYY-MM-DD')],
                });
            } catch (error) {
                message.error('获取测试计划信息失败');
                console.error('获取测试计划信息失败:', error);
            } finally {
                setLoading(false);
            }
        }
        setVisible(true);
    }, [props.type, testPlanId, findTestPlan, form]);

    // 提交表单
    const onFinish = useCallback(async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const submitData = {
                ...values,
                startTime: values.rangeTime[0],
                endTime: values.rangeTime[1],
                projectId,
            };

            if (props.type === "add") {
                await createTestPlan(submitData);
                message.success('创建测试计划成功');
            } else {
                submitData.id = testPlanId;
                await updateTestPlan(submitData);
                message.success('更新测试计划成功');
            }
            
            findPage();
            setVisible(false);
        } catch (error) {
            if (error.errorFields || error.errorFields.length > 0) {
                // 这是表单校验错误，不需要显示失败提示
                console.log('表单校验未通过:', error);
            } else {
                // 这是真正的提交失败
                message.error(props.type === "add" ? '创建测试计划失败' : '更新测试计划失败');
                console.error('提交测试计划失败:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [props.type, testPlanId, createTestPlan, updateTestPlan, findPage, form, projectId]);



    const onCancel = useCallback(() => {
        form.resetFields();
        setVisible(false);
    }, [form]);

    return (
        <>
            {props.name === "添加计划" ? (
                <Button className="important-btn" type="primary" onClick={showModal}>
                    {props.name}
                </Button>
            ) : (
                <IconCommon
                    icon="edit"
                    className="icon-s edit-icon"
                    onClick={showModal}
                />
            )}

            <Modal
                destroyOnClose
                title={props.name}
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={470}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    preserve={false}
                    layout="vertical"
                >
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[
                            { required: true, message: "请添加名称" },
                            { max: 50, message: "名称长度不能超过50个字符" }
                        ]}
                    >
                        <Input placeholder="请输入名称" maxLength={50} />
                    </Form.Item>

                    {
                        props.type === "edit" &&
                        <Form.Item
                            label="状态"
                            name="state"
                        >
                            <Select
                                placeholder="状态"
                            >
                                <Select.Option value={0} key={0}>未开始</Select.Option>
                                <Select.Option value={1} key={1}>进行中</Select.Option>
                                <Select.Option value={2} key={2}>已结束</Select.Option>
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item
                        label="日期范围"
                        name="rangeTime"
                        rules={[
                            { required: true, message: '日期范围未添加' },
                            {
                                validator: async (_, value) => {
                                    if (value && value[0] && value[1]) {
                                        if (value[0].isAfter(value[1])) {
                                            throw new Error('开始日期不能晚于结束日期');
                                        }
                                    }
                                }
                            }
                        ]}
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                    >
                        <RangePicker 
                            format="YYYY-MM-DD" 
                            style={{ width: "420px" }}
                            disabledDate={current => current && current < moment().startOf('day')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default observer(TestPlanEdit);
