import React, { useState } from 'react';
import { observer } from "mobx-react";
import { Form, Modal, Input, DatePicker } from 'antd';
import testReportStore from "../store/testReportStore";
import {FormOutlined} from "@ant-design/icons";
import Button from "../../../../common/button/Button";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 添加与编辑
const TestReportEdit = (props) => {
    const { reportId, findPage } = props;
    const { findTestReport, createTestReport, updateTestReport } = testReportStore;

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const projectId = localStorage.getItem('projectId');
    const testPlanId = sessionStorage.getItem('testPlanId');



    // 弹框展示
    const showModal = () => {
        if (props.type === "edit") {
            findTestReport(reportId).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    // rangeTime: [moment(res.startTime, 'YYYY-MM-DD'), moment(res.endTime, 'YYYY-MM-DD')],
                    // desc: res.desc
                });
            });
        }
        setVisible(true);
    };

    // 提交
    const onFinish = async () => {
        let values = await form.validateFields();

        // values.startTime = values.rangeTime[0];
        // values.endTime = values.rangeTime[1];
        // delete values.rangeTime;

        values.projectId = projectId;
        values.testPlan= {id:testPlanId};
        if (props.type === "add") {
            createTestReport(values).then(() => {
                findPage();
            });
        } else {
            values.id = reportId;
            updateTestReport(values).then(() => {
                findPage();
            });
        }
        setVisible(false);
    };

    const onCancel = () => { setVisible(false) };

    return (
        <>
            {
                props.name === "添加报告"
                    ? <Button
                        buttonText={props.name}
                        onClick={showModal}
                    />
                    : <FormOutlined style={{fontSize:16}} onClick={showModal} />
            }

            <Modal
                destroyOnClose={true}
                title={props.name}
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={470}
            >
                <Form
                    form={form}
                    preserve={false}
                    layout={"vertical"}
                >
                    <Form.Item
                        label="名称"
                        rules={[{ required: true, message: "请添加名称" }]}
                        name="name"
                    >
                        <Input placeholder="请输入名称" />
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    label="日期范围"*/}
                    {/*    name="rangeTime"*/}
                    {/*    rules={[{ required: true, message: '日期范围未添加' }]}*/}
                    {/*    wrapperCol={{*/}
                    {/*        offset: 0,*/}
                    {/*        span: 24,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <RangePicker format={'YYYY-MM-DD'} style={{ width: "420px" }} />*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    label="报告描述"*/}
                    {/*    name="desc"*/}
                    {/*>*/}
                    {/*    <TextArea rows={4} placeholder="请输入报告描述" />*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
        </>
    );
};

export default observer(TestReportEdit);
