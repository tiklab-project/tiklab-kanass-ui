/*
 * @Descripttion: 项目的事项进展概况统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:37:41
 */

import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "./WorkItemStatusSituation.scss";
import { Form, Select, Button } from 'antd';
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const WorkItemStatusSituation = (props) => {
    const { statisticsWorkItemStatusCount, reportList, findAllProject } = StatisticsStore;
    // 事项的各个状态的数据统计列表
    const [workItemStatusCount, setWorkItemStatusCount] = useState();
    const [project, setProject] = useState(null)
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

    // /**
    //  * 初始化统计条件表单
    //  */
    useEffect(() => {
        findAllProject().then(res => {
            setProjectList(res.data)
        })
        return;

    }, [])

    const onValuesChange = (values) => {
        const params = {
            projectId: values.projectId,
            workItemTypeCode: values.workItemTypeCode
        }
        statisticsWorkItemStatusCount(params).then(res => {
            setWorkItemStatusCount(res.data)
            setProject(res.data.project)
        })
    }

    return (
        <div className="statistics">
            <div className="statistics-top">
                <div className="statistics-work-title">事项进展概况统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onValuesChange={(changedValues, allValues) => {onValuesChange(allValues)}}
                    layout="horizontal"
                >
                    <Form.Item name="projectId"
                               label="项目"
                               rules={[{ required: true }]}
                               labelCol={{ flex: '100px' }}  // 固定 label 宽度
                               wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
                        <Select
                            style={{ width: '100%', maxWidth: '250px' }}
                            placeholder="请选择项目"
                        >
                            {
                                projectList && projectList.map(item => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="workItemTypeCode"
                               label="统计事项类型"
                               rules={[{ required: true }]}
                               labelCol={{ flex: '100px' }}  // 固定 label 宽度
                               wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
                        <Select
                            style={{ width: '100%', maxWidth: '250px' }}
                            placeholder="请选择统计事项类型"
                        >
                            {
                                workItemType && workItemType.map(item => {
                                    return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className="workitem-situation">
                <div className="workitem-situation-top">
                    <div className="workitem-situation-title">
                        <div>
                            事项进展概况
                        </div>
                    </div>
                </div>
                {
                    workItemStatusCount ?
                        <>
                            {
                                project ? <div className="workitem-situation-content">
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
                                    <ProjectEmpty description="请选择查询条件~"/>

                            }

                        </>
                        :
                        <>
                            {
                                <ProjectEmpty description="请选择查询条件~"/>
                            }
                        </>

                }

            </div>
        </div>

    )
}
export default (observer(WorkItemStatusSituation));