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
import { appendStageInTree, updateStageInfo, updateTree } from "./StageListTreeChange";
import moment from "moment";
const { TextArea } = Input;
const StageEditModal = (props) => {
    const { showStageEditModal, setShowStageEditModal, stageStore, stageId } = props;
    const { updateStage, useList, getUseList, stageList, findStage, findParentStageList, parentStageList } = stageStore
    const [form] = Form.useForm();
    const dateFormat = 'YYYY-MM-DD';
    // 项目id
    const projectId = props.match.params.id;
    const [parentId, setParentId] = useState();

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
    useEffect(() => {
        if(showStageEditModal){
            getUseList({ projectId: projectId });
            findStage({ id: stageId }).then(res => {
                if (res.code === 0) {
                    const data = res.data;
                    setParentId(data.parentStage?.id)
                    form.setFieldsValue({
                        stageName: data.stageName,
                        masterId: data.master.id,
                        parentStageId: data.parentStage?.id,
                        status: data.status,
                        planTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)],
                    })
                }
            })
            findParentStageList({ id: stageId, projectId: projectId }).then(res => {
                if (res.code === 0) {
                    console.log(res.data)
                }
            })
        }
        
        return;
    }, [showStageEditModal])

    /**
     * 提交添加计划
     */
    const submitVersion = () => {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                id: stageId,
                parentStage: { id: fieldsValue.parentStageId ? fieldsValue.parentStageId : "nullstring"},
                master: { id: fieldsValue.masterId },
                startTime: fieldsValue.planTime[0].format('YYYY-MM-DD'),
                endTime: fieldsValue.planTime[1].format('YYYY-MM-DD')
            };
            console.log(values);
            console.log(parentId)
            if(parentId === fieldsValue.parentStageId){
                console.log("没修改上级")
                values.isChangeParent = false;
            }else {
                values.isChangeParent = true;
            }
            updateStage(values).then(res => {
                if(res.code === 0){
                    if(values.isChangeParent){
                        updateTree(stageList, fieldsValue.parentStageId, stageId)
                    }else {
                        updateStageInfo(stageList, stageId,values)
                    }
                    
                    setShowStageEditModal(false)
                }
            })
        })
    }

    /**
     * 关闭弹窗重置表单
     */
    const closeModal = () => {
        form.resetFields();
        setShowStageEditModal(false);
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
                title={"编辑计划"}
                visible={showStageEditModal}
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
                    onFieldsChange = {(changedFields, allFields) => console.log(changedFields, allFields)}
                >
                    <Form.Item
                        label="上级计划"
                        name="parentStageId"
                        rules={[
                            {
                                message: '请选择上级计划',
                            },
                        ]}
                    >
                        <Select
                            placeholder="上级计划"
                            allowClear
                        >
                            {
                                parentStageList && parentStageList.map((item, index) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.stageName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

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
                        name="masterId"
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
                                useList && useList.map((item, index) => {
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
                        name="planTime"
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
                        <TextArea rows={4} maxLength={6} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};
export default withRouter(inject("stageStore")(observer(StageEditModal)));