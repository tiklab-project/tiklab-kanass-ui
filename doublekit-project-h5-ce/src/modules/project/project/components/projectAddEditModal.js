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
import "./projectAddEditModal.scss";
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
const ProjectAddEidtModal = (props) => {
    const { projectStore, visible, setVisible, setProjectList } = props;
    const { findAllUser, findAllProjectType, addProject, findProjectPage } = projectStore;
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

            findAllProjectType().then(data => {
                if (data.code === 0) {
                    const list = data.data;
                    const projectTypeList = [];
                    list && list.length > 0 && list.map(item => {
                        projectTypeList.push({ value: item.id, label: item.name });
                        return 0;
                    })
                    setProjectTypeList([projectTypeList]);
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
    const [statusPickerVisible, setStatusPickerVisible] = useState(false);
    const [userPickerVisible, setUserPickerVisible] = useState(false);
    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [projectTypePickerVisible, setProjectTypePickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);
    const onFinish = (values) => {
        const data = {
            projectName: values.projectName,
            projectKey: values.projectKey,
            projectType: {
                id: values.projectType[0]
            },
            master: {
                id: values.master[0]
            },
            desc: values.desc,
            startTime: dayjs(values.startTime).format('YYYY-MM-DD'),
            endTime: dayjs(values.endTime).format("YYYY-MM-DD"),
            projectState: values.projectState[0],
            iconUrl: values.iconUrl
        }
        addProject(data).then(data => {
            if (data.code === 0) {
                findProjectPage().then(data => {
                    setVisible(false)
                    if (data.code === 0) {
                        setProjectList(data.data.dataList)
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
                <Form.Header>添加项目</Form.Header>
                <Form.Item
                    label="项目名称"
                    name="projectName"

                    rules={[
                        {
                            required: true,
                            message: '请输入项目名称',
                        },
                    ]}
                >
                    <Input placeholder="项目名称" />
                </Form.Item>
                <Form.Item
                    label="项目Key"
                    name="projectKey"
                    rules={[
                        {
                            required: true,
                            message: '请输入项目键值',
                        },
                        {
                            pattern: /^[A-Za-z]+$/,
                            message: '只能包含字母!'
                        }
                    ]}
                >
                    <Input placeholder="项目键值" />
                </Form.Item>

                <Form.Item
                    label="项目类型"
                    name="projectType"
                    rules={[
                        {
                            required: true,
                            message: '请选择项目类型',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('projectType') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ projectType: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setProjectTypePickerVisible(true)
                    }}
                >

                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={projectTypeList}
                        visible={projectTypePickerVisible}
                        onClose={() => {
                            setProjectTypePickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择项目类型"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    label="项目状态"
                    name="projectState"
                    rules={[
                        {
                            required: true,
                            message: '请选择项目状态',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('projectState') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ projectState: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setStatusPickerVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={status}
                        visible={statusPickerVisible}
                        onClose={() => {
                            setStatusPickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请输入状态"
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
                    {/* <Input placeholder="项目名称" /> */}
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
                    {/* <Input placeholder="项目名称" /> */}
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
                    {/* <Input placeholder="项目名称" /> */}
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
                    label="项目描述"
                    name="desc"
                    rules={[
                        {
                            required: false,
                            message: '请输入项目描述',
                        },
                    ]}
                >
                    <Input placeholder="项目描述" />
                </Form.Item>
            </Form>
        </div>
    )
}
export default inject("projectStore")(observer(ProjectAddEidtModal));