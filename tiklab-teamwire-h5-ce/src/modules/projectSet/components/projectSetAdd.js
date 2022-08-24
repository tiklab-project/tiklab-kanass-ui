/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 13:23:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-24 10:52:06
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Picker, Button, DatePicker, Toast } from 'antd-mobile';
import { CloseCircleFill } from 'antd-mobile-icons';
import "./projectSetAdd.scss";
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
const ProjectSetAdd = (props) => {
    const { projectStore, visible, setVisible, setProjectSetList,projectSetStore } = props;
    const { findAllUser, addProject, findProjectPage } = projectStore;
    const { createProjectSet,findProjectSetPage } = projectSetStore;
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [projectTypeList, setProjectTypeList] = useState([]);
    useEffect(() => {
        if (visible) {
            findAllUser().then(data => {
                if (data.code === 0) {
                    const list = data.data;
                    const userPickList = [];
                    list && list.length > 0 && list.map(item => {
                        userPickList.push({ value: item.id, label: item.name });
                        return 0;
                    })
                    setUserList([userPickList]);
                }
            })
        }

    }, [visible])
    // 状态类型
    const status = [
        [{
            label: "未开始",
            value: "1"
        },
        {
            label: "进行中",
            value: "2"
        },
        {
            label: "已结束",
            value: "3"
        }]
    ]

    const limits = [
        [{
            label: "全员可见",
            value: "0"
        },
        {
            label: "项目集成员可见",
            value: "1"
        }]
    ]

    const [userPickerVisible, setUserPickerVisible] = useState(false);
    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);
    const [programLimitsVisible, setProgramLimitsVisible] = useState(false);


    const onFinish = (values) => {
        const data = {
            name: values.name,
            master: {
                id: values.master[0]
            },
            desc: values.desc,
            startTime: dayjs(values.startTime).format('YYYY-MM-DD'),
            endTime: dayjs(values.endTime).format("YYYY-MM-DD"),
            programLimits: values.programLimits[0],
        }
        createProjectSet(data).then(data => {
            if (data.code === 0) {
                findProjectSetPage().then(data => {
                    setVisible(false)
                    if (data.code === 0) {
                        setProjectSetList(data.data.dataList)
                    }

                })
            }
            if (data.code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: data.msg,
                })
            }
        })
    }

    return (
        <div>
            <Form
                initialValues={{
                    remember: true,
                }}
                form={form}
                className='project-add-form'
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='small'>
                        提交
                    </Button>
                }
            >
                <Form.Header>添加项目集</Form.Header>
                <Form.Item
                    label="项目集名称"
                    name="name"

                    rules={[
                        {
                            required: true,
                            message: '请输入项目集名称',
                        },
                    ]}
                >
                    <Input placeholder="项目集名称" />
                </Form.Item>
              

                
                <Form.Item
                    label="项目集可见范围"
                    name="programLimits"
                    rules={[
                        {
                            required: true,
                            message: '请选择项目集状态',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('programLimits') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ programLimits: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setProgramLimitsVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={limits}
                        visible={programLimitsVisible}
                        onClose={() => {
                            setProgramLimitsVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择可见范围"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    label="负责人"
                    name="master"
                    rules={[
                        {
                            required: true,
                            message: '请选择负责人',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('master') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ master: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setUserPickerVisible(true)
                    }}
                >
                    {/* <Input placeholder="项目集名称" /> */}
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={userList}
                        visible={userPickerVisible}
                        onClose={() => {
                            setUserPickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择负责人"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="计划开始日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择计划开始日期',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('startTime') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ startTime: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setPlanStartPickerVisible(true)
                    }}
                >
                    {/* <Input placeholder="项目集名称" /> */}
                    <DatePicker
                        visible={planStartPickerVisible}
                        onClose={() => {
                            setPlanStartPickerVisible(false)
                        }}
                    >
                        {value =>
                            value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期'
                        }
                    </DatePicker>
                </Form.Item>

                <Form.Item
                    name="endTime"
                    label="计划结束日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择计划结束日期',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('endTime') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ endTime: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setPlanEndPickerVisible(true)
                    }}
                >
                    {/* <Input placeholder="项目集名称" /> */}
                    <DatePicker
                        visible={planEndPickerVisible}
                        onClose={() => {
                            setPlanEndPickerVisible(false)
                        }}
                    >
                        {value =>
                            value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期'
                        }
                    </DatePicker>
                </Form.Item>

                <Form.Item
                    label="项目集描述"
                    name="desc"
                    rules={[
                        {
                            required: false,
                            message: '请输入项目集描述',
                        },
                    ]}
                >
                    <Input placeholder="项目集描述" />
                </Form.Item>
            </Form>
        </div>
    )
}
export default inject("projectStore","projectSetStore")(observer(ProjectSetAdd));