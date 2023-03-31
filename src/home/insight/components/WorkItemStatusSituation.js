/*
 * @Descripttion: 项目的事项进展概况统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "./WorkItemStatusSituation.scss";
import { Form, Select, Button, DatePicker } from 'antd';
const WorkItemStatusSituation = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsWorkItemStatusCount, reportList, findAllProject } = insightStore;
    // 事项的各个状态的数据统计列表
    const [workItemStatusCount, setWorkItemStatusCount] = useState();
    // 是否编辑视图
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    // 所有的项目列表
    const [projectList, setProjectList] = useState([]);
    // 统计条件的表单
    const [form] = Form.useForm();

    // 事项类型
    const workItemType = [
        {
            value: "all",
            title: "全部"
        },
        {
            value: "demand",
            title: "需求"
        },
        {
            value: "task",
            title: "任务"
        },
        {
            value: "defect",
            title: "缺陷"
        }
    ]

     /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        findAllProject().then(res => {
            setProjectList(res.data)
        })
        if (isEditor) {
            const data = condition.data.data
            const params = {
                projectId: data.projectId,
                workItemTypeCode: data.workItemTypeCode
            }
            form.setFieldsValue(params)
            
            statisticsWorkItemStatusCount(params).then(res => {
                setWorkItemStatusCount(res.data)
            })
        }

    }, [isEditor])

    /**
     * 编辑统计条件
     * @param {表单数据} values 
     */
    const editReport = (values) => {
        setIsEditor(!isEditor)
        reportList.lg[index].data.data = values;
        reportList.lg[index].data.isEdit = true;
        statisticsWorkItemStatusCount(values).then(res => {
            setWorkItemStatusCount(res.data)
        })
    }

    /**
     * 删除报表
     */
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <div className="workitem-situation" key={condition.i} data-grid={condition}>
            <div className="workitem-situation-top">
                <div className="workitem-situation-title">
                    <div>
                        项目进展概况
                    </div>
                    {
                        !isView && <div className="report-action">
                            <div onClick={() => setIsEditor(!isEditor)}
                                className="report-action-edit"
                            >
                                {isEditor ? "编辑" : "取消"}
                            </div>
                            <div
                                onClick={() => deleteReport()}
                                className="report-action-delete"
                            >
                                删除
                            </div>
                        </div>
                    }
                </div>
            </div>
            {
                isEditor && workItemStatusCount ? <div className="workitem-situation-content">
                    <div className="workitem-situation-content-item">
                        <div>{workItemStatusCount.all} 个</div>
                        <div>全部事项</div>
                    </div>
                    <div className="workitem-situation-content-item">
                        <div>{workItemStatusCount.noEnd} 个</div>
                        <div>已完成事项</div>
                    </div>
                    <div className="workitem-situation-content-item">
                        <div>{workItemStatusCount.start} 个</div>
                        <div>已开始事项</div>
                    </div>
                    <div className="workitem-situation-content-item">
                        <div>{workItemStatusCount.todo} 个</div>
                        <div>未开始事项</div>
                    </div>
                    <div className="workitem-situation-content-item">
                        <div>{workItemStatusCount.overdue} 个</div>
                        <div>已逾期事项</div>
                    </div>
                </div>
                    :
                    <Form
                        name="form"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={editReport}
                        wrapperCol={{ span: 12 }}
                        labelCol={{ span: 6 }}
                        layout = "vertical"
                    >
                        <Form.Item name="projectId" label="项目" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择项目"
                            >
                                {
                                    projectList && projectList.map(item => {
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="workItemTypeCode" label="统计事项类型" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择统计事项类型"
                            >
                                {
                                    workItemType && workItemType.map(item => {
                                        return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ offset: 6, span: 8 }}
                        >
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
            }

        </div>
    )
}
export default inject("insightStore")(observer(WorkItemStatusSituation));