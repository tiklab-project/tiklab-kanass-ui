/*
 * @Descripttion: 新增事项趋势
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker } from 'antd';
import "./WorkItemTrend.scss";
import * as echarts from 'echarts';
import moment from "moment";

const { RangePicker } = DatePicker;

const WorkItemTrend = (props) => {
    const { insightStore,index, editInsight, isView, condition } = props;
    const { statisticsDayWorkItemCount, findAllProject, reportList } = insightStore;
    // 是否编辑视图
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    // 统计条件的表单
    const [form] = Form.useForm();
    // 所有的项目列表
    const [projectList, setProjectList] = useState([]);


    useEffect(() => {
        // 获取所有项目列表
        findAllProject().then(res => {
            setProjectList(res.data)
        })
    }, [])

    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        const data  = condition.data.data
        if(isEditor){
            const params = {
                startDate: data.startDate,
                endDate: data.endDate,
                cellTime: data.cellTime,
                projectId: data.projectId

            }
            statisticsDayWorkItem(params)

            const formData = {
                dateRanger:[moment(data.startDate, 'YYYY-MM-DD HH:mm:ss'), moment(data.endDate, 'YYYY-MM-DD HH:mm:ss')],
                cellTime: data.cellTime,
                workItemTypeCode: data.workItemTypeCode,
                projectId: data.projectId
            }

            form.setFieldsValue(formData)
        }
        
    },[isEditor])

    /**
     * 处理统计数据
     */
     const statisticsDayWorkItem = (value) => {
        
        const chartDom = document.getElementById("workitem-trend")
        statisticsDayWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const data = res.data;
                const xAxisData = data.date.map(item => {
                    return item.slice(0, 10)
                })
                const yAxisNew = [];
                const yAxisEnd = [];
                const yAxisRemain = [];
                data.conntList.map(item => {
                    yAxisNew.push(item.new)
                    yAxisEnd.push(item.end)
                    yAxisRemain.push(item.remain)
                    return item;
                })
                let myChart = echarts.init(chartDom);
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['New', 'End', 'Remain']
                    },

                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },

                    series: [
                        {
                            name: "New",
                            data: yAxisNew,
                            type: 'bar',
                        },
                        {
                            name: "End",
                            data: yAxisEnd,
                            type: 'bar',
                        },
                        {
                            name: "Remain",
                            data: yAxisRemain,
                            type: 'line',
                        },
                    ]
                };
                myChart.setOption(option);
            }
        })
    }

    /**
     * 编辑统计条件
     * @param {表单数据} values 
     */
    const editReport = (values) => {
        const params = {
            startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            cellTime: values.cellTime,
            workItemTypeCode: values.workItemTypeCode,
            projectId: values.projectId
        }
        console.log(params, index)
        setIsEditor(!isEditor)
        statisticsDayWorkItem(params)
        reportList.lg[index].data.data = params;
        reportList.lg[index].data.isEdit = true;
    }

    // 统计的时间单位
    const dateList = [
        {
            value: "day",
            title: "天"
        },
        {
            value: "week",
            title: "周"
        },
        {
            value: "month",
            title: "月"
        },
        {
            value: "quarter",
            title: "季度"
        },
        {
            value: "year",
            title: "年"
        }
    ]

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
     * 删除报表
     */
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <Fragment>
            <div className="workitem-trend"  key = {condition.i} data-grid={condition}>
                <div className="workitem-trend-top">
                    <div className="workitem-trend-title">
                        <div>
                            事项趋势
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
                    isEditor ? <div className="workitem-trend-content" id={`workitem-trend-${index}`} />
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

                        <Form.Item name="cellTime" label="期间" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择期间"
                            >
                                {
                                    dateList && dateList.map(item => {
                                        return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="dateRanger" label="开始结束时间" rules={[{ required: true }]}>
                            <RangePicker />
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

        </Fragment >

    )
}

export default inject("insightStore")(observer(WorkItemTrend));