/*
 * @Descripttion: 完成事项趋势
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:04:22
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker, Empty } from 'antd';
import echarts from "../../../common/echarts/echarts"
import "./CompleteWorkItemTrend.scss"
import moment from "moment";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import {defaultDateFormat, getFirstDayOfMonth, getLastDayOfMonth, getNowFormatDate} from "../StatisticsDateFormat";

const { RangePicker } = DatePicker;


const CompleteWorkItemTrend = (props) => {
    const { noEdit } = props;
    const { statisticsEndWorkItemCount, findAllProject, reportList } = StatisticsStore;

    // 表单
    const [form] = Form.useForm();
    // 所有项目的列表
    const [projectList, setProjectList] = useState([]);
    const [projectCountList, setProjectCountList] = useState(null)


    const [chart, setChart] = useState();

    useEffect(() => {
        /**
         * 查找所有项目列表
         */
        findAllProject().then(res => {
            if (res.code === 0 && res.data.length > 0){
                setProjectList(res.data)
                form.setFieldsValue({
                    projectId: res.data[0].id,
                    cellTime: "day",
                    dateRanger: [moment(getFirstDayOfMonth(), defaultDateFormat), moment(getLastDayOfMonth(), defaultDateFormat)],
                    workItemTypeCode: "all"
                })

                onValuesChange({
                    projectId: res.data[0].id,
                    cellTime: "day",
                    dateRanger: [moment(getFirstDayOfMonth(), defaultDateFormat), moment(getLastDayOfMonth(), defaultDateFormat)],
                    workItemTypeCode: "all"
                })
            }
        })
        return;
    }, [])


    /**
     * 处理统计数据
     */
    const setStatisticsData = (params) => {
        const chartDom = document.getElementById(`end-trend`)
        statisticsEndWorkItemCount(params).then(res => {
            if (res.code === 0) {
                const list = res.data;
                let seriesValue = []
                const projectCountList = list.projectCountList
                setProjectCountList(list.projectCountList)
                if (projectCountList) {
                    if (list.projectCountList.length > 0) {
                        const legendDate = list.projectCountList.map(item => {
                            seriesValue.push({
                                name: item.project.projectName,
                                type: 'line',
                                stack: 'Total',
                                data: item.countList
                            })
                            return item.project.projectName
                        })
                        const axisValue = list.dateList.map(item => {
                            return item.slice(0, 10)
                        })
                        let myChart = echarts.init(chartDom);
                        setChart(myChart)
                        let option = {
                            // title: {
                            //     text: '新增完成事项趋势'
                            // },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: legendDate
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: axisValue
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: seriesValue
                        };
                        myChart.setOption(option);
                    }
                }

            }
        })
    }

    const onValuesChange = (values) => {
        if (!values.dateRanger || !values.cellTime || !values.workItemTypeCode || !values.projectId){
            return;
        }
        const params = {
            startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            cellTime: values.cellTime,
            workItemTypeCode: values.workItemTypeCode,
            projectId: values.projectId

        }
        setStatisticsData(params)
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

    // 统计的事项类型
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
            {
                !noEdit &&
                <div className="statistics-top">
                    <div className="statistics-work-title">完成事项趋势统计</div>
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
                                bordered={false}
                                style={{backgroundColor: '#f0f0f0'}}
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
                                bordered={false}
                                style={{backgroundColor: '#f0f0f0'}}
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
                                bordered={false}
                                style={{backgroundColor: '#f0f0f0'}}
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
            }

            <div className="end-trend">
                <div className="end-trend-top">
                    <div className="end-trend-title">
                        <div>
                            完成事项趋势
                        </div>
                    </div>
                </div>

                <div className="end-trend-content" id={`end-trend`} >
                    {
                        !projectCountList && <ProjectEmpty description="请选择查询条件~"/>
                    }
                </div>

            </div>
        </div>

    )
}

export default (observer(CompleteWorkItemTrend));