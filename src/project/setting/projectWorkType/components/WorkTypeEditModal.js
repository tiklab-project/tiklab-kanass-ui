/*
 * @Descripttion: 项目的事项类型列表编辑弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

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
    // 显示编辑弹窗
    const [visible, setVisible] = useState(false);
    const { projectWorkTypeStore } = props;
    const { editWorkType, getFormList, getFlowList, formList,
        flowList, findWorkTypeDmtById, findWorkTypeDmList } = projectWorkTypeStore;
    // 项目id
    const projectId = props.match.params.id;

    /**
     * 显示编辑弹窗
     */
    const showModal = () => {
        setVisible(true);
        getFormList({ projectId: projectId })
        getFlowList({ projectId: projectId })
        //根据id查找事项类型
        findWorkTypeDmtById(props.id).then((res) => {
            if (res.code === 0) {
                form.setFieldsValue({
                    name: res.data.workType.name,
                    // form: res.data.form.id,
                    // flow: res.data.flow.id
                })
            }

        })
    };

    /**
     * 提交编辑信息，保存
     */
    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = { ...values }
            data.id = props.id;
            editWorkType(data).then(res => {
                if (res.code === 0) {
                    setVisible(false);
                    findWorkTypeDmList({ projectId: projectId })
                }
            })
        })

    };

    /**
     * 取消编辑
     */
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
                        {/* <Form.Item
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
                        {formList && formList.length <= 0 && <div className="form-add" onClick={() => props.history.push("/setting/form")}>没有自定义表单，点击添加</div>} */}
                        {/* <Form.Item
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
                        </Form.Item> */}
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default withRouter(inject("projectWorkTypeStore")(observer(WorkTypeEditModal)));