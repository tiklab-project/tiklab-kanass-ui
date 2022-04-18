/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 10:36:44
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:11:21
 */
import React, { useEffect, useState, Fragment } from 'react';
import { Modal, Select, Form, Input, DatePicker } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
const { RangePicker } = DatePicker;


const ProgramAdd = (props) => {
    const { visible, setVisible, name, programStore, type, programId, setType } = props;
    const { uselist, addProgramSet, getProgramlist, findProgram, updateProgram } = programStore;
    const [form] = Form.useForm();
    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        if (type === "edit") {
            findProgram(programId).then((response) => {
                if (response.code === 0) {
                    const data = response.data
                    form.setFieldsValue({
                        name: data.name,
                        remark: data.remark,
                        master: data.master.id,
                        startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                    })
                }
            })
        }
    }, [type, programId]);

    // 表单的布局
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };

    
    

    /**
     * 提交表单
     */
    const submitFrom = () => {
        form.validateFields().then((fieldsValue) => {
            const time = fieldsValue["startTime"]
            const values = {
                ...fieldsValue,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: {
                    id: fieldsValue["master"]
                }
            }
            if (type === "add") {
                addProgramSet(values).then((response) => {
                    if (response.code === 0) {
                        setVisible(false)
                        setType("")
                        getProgramlist()
                    }
                })
            } else if (type === "edit") {
                const updateValue = {
                    ...values,
                    id: programId
                }
                updateProgram(updateValue).then((response) => {
                    if (response.code === 0) {
                        setVisible(false)
                        setType("")
                        getProgramlist()
                    }
                })
            }
        })
    }

    const submitCancel = () => {
        setVisible(false)
        form.resetFields()
        setType("")
    }

    return <Modal
            title={name}
            visible={visible}
            onOk={submitFrom}
            onCancel={submitCancel}
            cancelText="取消"
            okText="确定"
            destroyOnClose={true}
        >
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                form={form}
                preserve={false}
            >
                <Form.Item
                    label="项目集名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入项目集名称',
                        },
                        {
                            pattern: /^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$/,
                            message: '用户名不能包含非法字符，如&,%，&，#……等',
                        }
                    ]}
                >
                    <Input placeholder="请输入项目集名称" />
                </Form.Item>
                <Form.Item
                    label="项目负责人"
                    name="master"
                    rules={[
                        {
                            required: true,
                            message: '请选择项目集负责人',
                        },
                    ]}
                >
                    <Select
                        placeholder="负责人"
                        allowClear
                    >
                        {
                            uselist && uselist.map((item, index) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="startTime"
                    label="项目集周期"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select time!',
                        }
                    ]}
                >
                    <RangePicker locale={locale} />
                </Form.Item>
                <Form.Item
                    label="项目集描述"
                    name="remark"
                    rules={[
                        {
                            required: false,
                            message: '请输入项目集描述',
                        }
                    ]}
                >
                    <Input placeholder="输入项目集描述" />
                </Form.Item>
            </Form>
        </Modal>
}
export default inject("programStore")(observer(ProgramAdd))