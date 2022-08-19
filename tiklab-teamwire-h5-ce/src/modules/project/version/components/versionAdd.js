/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 13:23:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-24 10:52:06
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Picker, Button, DatePicker, NavBar,Toast } from 'antd-mobile';
import { CloseCircleFill } from 'antd-mobile-icons';
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
import { withRouter } from 'react-router';
const VersionAdd = (props) => {
    const { versionStore } = props;
    const {createVersion} = versionStore
    const [form] = Form.useForm();
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
    }, [])
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
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);


    const onFinish = (values) => {
        const data = {
            name: values.versionName,
            startTime: dayjs(values.startTime).format('YYYY-MM-DD'),
            publishDate: dayjs(values.publishDate).format("YYYY-MM-DD"),
            versionState: values.versionState[0],
            project: {id: projectId}
        }
        createVersion(data).then(data => {
            if(data.code === 0){
                Toast.show({
                    content: '添加成功'
                })
                props.history.goBack()
            }
        })
    }

    return (
        <div>
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    添加版本
                </div>
            </NavBar>
            <Form
                initialValues={{
                    remember: true,
                }}
                form={form}
                className='version-add-form'
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='small'>
                        提交
                    </Button>
                }
            >
                <Form.Header>添加版本</Form.Header>
                <Form.Item
                    label="版本名称"
                    name="versionName"

                    rules={[
                        {
                            required: true,
                            message: '请输入版本名称',
                        },
                    ]}
                >
                    <Input placeholder="版本名称" />
                </Form.Item>

                <Form.Item
                    label="版本状态"
                    name="versionState"
                    rules={[
                        {
                            required: true,
                            message: '请选择版本状态',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('versionState') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ versionState: null })
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
                    name="publishDate"
                    label="发布日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择发布日期',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('publishDate') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ publishDate: null })
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
            </Form>
        </div>
    )
}
export default withRouter(inject("versionStore")(observer(VersionAdd)));