import React, { useState, useEffect } from "react";
import { Modal, Select, Space, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { RangePicker } = DatePicker;
import { withRouter } from "react-router";
const { TextArea } = Input;
const StageAddModal = (props) => {
    const {showStageAddMoal, setShowStageAddModal,stageStore, setStageList, addChild, parent} = props;
    const {createStage, uselist,getUseList, findStageList} = stageStore
    const [form] = Form.useForm();

    const projectId = props.match.params.id;
    
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };

    useEffect(()=> {
        getUseList({projectId: projectId})
    },[])

    //提交用户列表
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
                    id: parent
                }
            }
            createStage(values).then(() => {
                // findVersion({ projectId: projectId })
                findStageList({ projectId: projectId, stageParentNull: true}).then(res => {
                    if(res.code === 0){
                        setStageList(res.data)
                    }
                })
                setShowStageAddModal(false);
            })
        })

    }

    // 表单验证
    const onFinishFailed = () => {
        form.resetFields();
        setShowStageAddModal(false);
    }

    // const showModal = () => {
    //     setVisible(true);
    //     if (props.type === "edit") {
    //         searchVersionById({ id: props.id }).then((res) => {
    //             form.setFieldsValue({
    //                 name: res.name,
    //                 project: res.project.id,
    //                 publishDate: res.publishDate ? moment(res.publishDate) : null,
    //                 startTime: res.startTime ? moment(res.startTime) : null,
    //                 versionState: res.versionState
    //             })
    //         })
    //     }
    // };

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
                title={"添加阶段"}
                visible={showStageAddMoal}
                width={520}
                onOk={submitVersion}
                onCancel={onFinishFailed}
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
                        label="阶段名称"
                        name="stageName"
                        rules={[
                            {
                                required: true,
                                message: '请输入阶段名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入阶段名称" />
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
                                uselist && uselist.map((item,index)=> {
                                    return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="阶段状态"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: '请选择阶段状态',
                            },
                        ]}
                    >
                        <Select
                            placeholder="阶段状态"
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
                        label="阶段描述"
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入阶段描述',
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