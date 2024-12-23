/*
 * @Descripttion: 计划添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-18 14:45:06
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 16:24:38
 */
import React, { useState, useEffect } from "react";
import { Modal, Select, Space, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
const { RangePicker } = DatePicker;
import { withRouter } from "react-router";
import { appendStageInTree } from "./StageListTreeChange";
const { TextArea } = Input;
const StageAddModal = (props) => {
    const {showStageAddMoal, setShowStageAddModal,stageStore, addChild, parentId} = props;
    const {createStage, useList,getUseList, findStageListTreePage, stageList,setStageList, findStage} = stageStore
    const [form] = Form.useForm();
    // 项目id
    const projectId = props.match.params.id;
    
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };

    /**
     * 获取项目成员
     */
    useEffect(()=> {
        getUseList({projectId: projectId});
        return;
    },[])

    /**
     * 提交添加计划
     */
    const submitVersion = () => {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                project: {id: projectId},
                master: {id: fieldsValue.master},
                startTime: fieldsValue.startTime[0].format('YYYY-MM-DD'),
                endTime: fieldsValue.startTime[1].format('YYYY-MM-DD')
            };
            if(addChild === "child"){
                values.parentStage = {
                    id: parentId
                }
            }
            createStage(values).then((res) => {
                if(res.code === 0){
                    findStage({id: res.data}).then(data => {
                        if(data.code === 0){
                            appendStageInTree(stageList, parentId, data.data)
                            setStageList([...stageList])
                            form.resetFields();
                            setShowStageAddModal(false);
                        }
                    })
                }
                // findStageListTreePage({ projectId: projectId}).then(res => {
                //     if(res.code === 0){
                //         form.resetFields();
                //     }
                // })
               
            })
        })
    }

    /**
     * 关闭弹窗重置表单
     */
    const closeModal = () => {
        form.resetFields();
        setShowStageAddModal(false);
    }

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "0"
        },
        {
            name: "进行中",
            id: "1"
        },
        {
            name: "已发布",
            id: "2"
        }
    ]

    return (
        <div className="addmodel">
            <Modal
                title={"添加计划"}
                visible={showStageAddMoal}
                width={520}
                onOk={submitVersion}
                onCancel={closeModal}
                cancelText="取消"
                okText="确定"
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        project: projectId
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="计划名称"
                        name="stageName"
                        rules={[
                            {
                                required: true,
                                message: '请输入计划名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入计划名称" />
                    </Form.Item>
                    <Form.Item
                        label="负责人"
                        name="master"
                        rules={[
                            {
                                required: true,
                                message: '请输入负责人',
                            },
                        ]}
                    >
                        <Select
                            placeholder="负责人"
                            allowClear
                        >   
                            {
                                useList && useList.map((item,index)=> {
                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="计划状态"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: '请选择计划状态',
                            },
                        ]}
                    >
                        <Select
                            placeholder="计划状态"
                            allowClear
                        >
                            {
                                status && status.map((item, index) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="开始结束时间"
                        name="startTime"
                        rules={[
                            {
                                required: true,
                                message: '请选择起始日期',
                            }
                        ]}
                    >
                        <RangePicker />
                    </Form.Item>
                    <Form.Item
                        label="计划描述"
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入计划描述',
                        },
                        ]}
                    >
                        <TextArea rows={4}  maxLength={6} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};
export default withRouter(inject("stageStore")(observer(StageAddModal)));