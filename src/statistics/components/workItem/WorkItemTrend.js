/*
 * @Descripttion: 新增事项趋势
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:37:54
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker } from 'antd';
import "./WorkItemTrend.scss";
import echarts from "../../../common/echarts/echarts"
import moment from "moment";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";

const { RangePicker } = DatePicker;

const WorkItemTrend = (props) => {
    const { statisticsDayWorkItemCount, findAllProject, reportList } = StatisticsStore;
    // 统计条件的表单
    const [form] = Form.useForm();
    // 所有的项目列表
    const [projectList, setProjectList] = useState([]);
    const [chart, setChart] = useState(null)
    const [project, setProject] = useState({});
    useEffect(() => {
        // 获取所有项目列表
        findAllProject().then(res => {
            setProjectList(res.data)
        })
        return;
    }, [])


    /**
     * 处理统计数据
     */
    const statisticsDayWorkItem = (value) => {

        const chartDom = document.getElementById(`workitem-trend`)
        statisticsDayWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const data = res.data;
                const project = data.project;
                setProject(project)
                if (project) {
                    const xAxisData = data.date.map(item => {
                        return item.slice(0, 10)
                    })
                    const yAxisNew = [];
                    const yAxisEnd = [];
                    const yAxisRemain = [];
                    data.countList.map(item => {
                        yAxisNew.push(item.new)
                        yAxisEnd.push(item.end)
                        yAxisRemain.push(item.remain)
                        return item;
                    })
                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
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
            }
        })
    }

    const onValuesChange  = (values) => {
        const params = {
            startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            cellTime: values.cellTime,
            workItemTypeCode: values.workItemTypeCode,
            projectId: values.projectId
        }

        statisticsDayWorkItem(params)
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



    return (
        <div className="statistics">
            <div className="statistics-top">
                <div className="statistics-work-title">事项趋势</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onValuesChange={(changedValues, allValues) => {onValuesChange(allValues)}}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }}
                    layout="inline"
                >
                    <Form.Item name="projectId"
                               label="项目"
                               rules={[{ required: true }]}
                               labelCol={{ flex: '100px' }}  // 固定 label 宽度
                               wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
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

                    <Form.Item
                        name="cellTime"
                        label="期间"
                        rules={[{ required: true }]}
                        labelCol={{ flex: '100px' }}  // 固定 label 宽度
                        wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
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
                    <Form.Item name="dateRanger"
                               label="开始结束时间"
                               rules={[{ required: true }]}
                               labelCol={{ flex: '100px' }}  // 固定 label 宽度
                               wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
                        <RangePicker
                            style={{
                                width: '100%',
                                maxWidth: '600px' // 可选：限制最大宽度
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="workItemTypeCode"
                               label="统计事项类型"
                               rules={[{ required: true }]}
                               labelCol={{ flex: '100px' }}  // 固定 label 宽度
                               wrapperCol={{ flex: 'auto' }}  // 剩余空间给输入控件
                    >
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
                </Form>
            </div>
            <div className="workitem-trend">
                <div className="workitem-trend-top">
                    <div className="workitem-trend-title">
                        <div>
                            事项趋势
                        </div>
                    </div>
                </div>
                {
                    <div className="workitem-trend-content" id={`workitem-trend`}>
                    </div>
                }

            </div>
        </div>

    )
}

export default (observer(WorkItemTrend));