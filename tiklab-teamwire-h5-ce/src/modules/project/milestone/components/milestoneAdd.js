/*
 * @Descripttion: 
 * @milestone: 1.0.0
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
const MilestoneAdd = (props) => {
    const { milestoneStore } = props;
    const {createMilestone,getUseList} = milestoneStore
    const [form] = Form.useForm();
    const projectId = localStorage.getItem("projectId");
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        getUseList(projectId).then(res => {
            if(res.code === 0){
                const dataList = res.data.dataList;
                const list = [];
                dataList && dataList.length > 0 && dataList.map(item => {
                    list.push({ value: item.user.id, label: item.user.name });
                    return 0;
                })
                setUserList([list])
            }
        })
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
            name: values.milestoneName,
            milestoneTime: dayjs(values.publishDate).format("YYYY-MM-DD"),
            project: {id: projectId},
            milestoneStatus: "0",
            master: {id: values.master[0]}
        }
        createMilestone(data).then(data => {
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
                    添加里程碑
                </div>
            </NavBar>
            <Form
                initialValues={{
                    remember: true,
                }}
                form={form}
                className='milestone-add-form'
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='small'>
                        提交
                    </Button>
                }
            >
                <Form.Header>添加里程碑</Form.Header>
                <Form.Item
                    label="里程碑名称"
                    name="milestoneName"

                    rules={[
                        {
                            required: true,
                            message: '请输入里程碑名称',
                        },
                    ]}
                >
                    <Input placeholder="里程碑名称" />
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
                    {/* <Input placeholder="迭代名称" /> */}
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
                    name="milestoneTime"
                    label="发布日期"
                    rules={[
                        {
                            required: true,
                            message: '请选择发布日期',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('milestoneTime') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ milestoneTime: null })
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
export default withRouter(inject("milestoneStore")(observer(MilestoneAdd)));