import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, message, } from 'antd';
import "./WorkType.scss";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 24,
    },
};


const WorkTypeEditModal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const { projectWorkStore } = props;
    const { editWorkType, getFormList, getFlowList, formList, 
        flowList, findWorkTypeDmtById, findWorkTypeDmList } = projectWorkStore;
    const projectId = props.match.params.id;


    const showModal = () => {
        setVisible(true);
        getFormList({ projectId: projectId })
        getFlowList({ projectId: projectId })

        findWorkTypeDmtById(props.id).then((res) => {
            form.setFieldsValue({
                name: res.workType.name,
                form: res.form.id,
                flow: res.flow.id
            })
        })
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = { ...values }
            data.id = props.id;
            editWorkType(data).then(res => {
                if(res.code === 0) {
                    setVisible(false);
                    findWorkTypeDmList({projectId: projectId})
                }
            })
        })

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    return (
        <>
            <div >
                <svg className="svg-icon" aria-hidden="true" onClick={showModal}>
                    <use xlinkHref="#icon-edit"></use>
                </svg>
                <Modal
                    title="添加事项类型"
                    visible={visible}
                    // footer={null}
                    onOk={onFinish}
                    onCancel={onCancel}
                    className="work-type-addmodel"
                    closable={false}
                >
                    <Form
                        {...layout}
                        name="basic"
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Form.Item
                            label="类型名称"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入状态名称',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="表单配置"
                            name="form"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择表单配置',
                                },
                            ]}
                        >
                            <Select
                                placeholder="默认"
                                allowClear
                            >
                                {
                                    formList && formList.map((item) => {
                                        return <Select.Option value={item.form.id} key={item.form.id}>{item.form.name}</Select.Option>
                                    })
                                }
                            </Select>
                            
                        </Form.Item>
                        {formList && formList.length <= 0 && <div className="form-add" onClick={() => props.history.push("/index/setting/form")}>没有自定义表单，点击添加</div>}
                        <Form.Item
                            label="流程配置"
                            name="flow"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择流程配置',
                                },
                            ]}
                        >
                            <Select
                                placeholder="默认"
                                allowClear
                            >
                                {
                                    flowList && flowList.map((item) => {
                                        return <Select.Option value={item.flow.id} key={item.flow.id}>{item.flow.name}</Select.Option>
                                    })

                                }
                            </Select>
                        </Form.Item>
                        {/* <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button htmlType="button" onClick={onCancel}>
                            取消
                        </Button>
                    </Form.Item> */}
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default withRouter(inject("projectWorkStore")(observer(WorkTypeEditModal)));