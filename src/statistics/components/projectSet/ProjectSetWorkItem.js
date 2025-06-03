/*
 * @Descripttion: 项目集的项目事项对比
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:36:39
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import {Form, Select, Button, Empty, message} from 'antd';
import "./ProjectSetWorkItem.scss";
import echarts from "../../../common/echarts/echarts"
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";


const ProjectSetWorkItem = (props) => {
    // const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsProjectWorkItemCount, findAllProjectSet, reportList } = StatisticsStore;

    // 统计条件的表单
    const [form] = Form.useForm();
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    // 统计项目成员的列表
    const [project, setProjectWorkitem] = useState([])
    const [chart, setChart] = useState(null)
    const [projectSet, setProjectSet] = useState({});
    useEffect(() => {
        /**
         * 查找所有项目集并设置默认项目集
         */
        findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    /**
     * 处理统计数据
     */
    const statisticsProjectWorkItem = (value) => {
        const chartDom = document.getElementById(`project-workitem`)
        statisticsProjectWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const project = res.data.project;
                const types = res.data.types;
                const series = []
                const yAxisValue = []
                const projectSet = res.data.projectSet;
                setProjectSet(projectSet)
                setProjectWorkitem(project)

                if(!projectSet){
                    form.setFieldsValue({ projectSetId: null })
                }
                if (projectSet) {
                    if (res.data.project == null){
                        message.error("当前项目集下无项目")
                        yAxisValue.push("")
                        series.push({
                            name: "",
                            type: 'bar',
                            stack: 'total',
                            itemStyle: {
                                opacity: 0         // 完全透明
                            },
                            label: {
                                show: false        // 不显示标签
                            },
                            emphasis: {
                                disabled: true    // 禁用交互
                            },
                            data: [0]
                        })
                    }else {
                        project.project.map((item, index) => {
                            yAxisValue.push(item.projectName.length > 13 ? item.projectName.substring(0,13) + "..." : item.projectName);
                        })
                        project.countList.map((item, index) => {
                            // yAxisValue.push(item.projectName)
                            series.push({
                                name: types[index],
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: item
                            })
                        })
                    }
                    if (chart){
                        chart.clear()
                    }
                    console.log("series:----" + JSON.stringify(series))
                    console.log("yAxisValue:----" + JSON.stringify(yAxisValue))
                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                // Use axis to trigger tooltip
                                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                            }
                        },
                        legend: {},
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: yAxisValue
                        },
                        series: series
                    };
                    myChart.setOption(option);
                }



            }
        })
    }


    return (
        <div className="statistics">
            <div className="statistics-top">
                <div className="statistics-work-title">项目事项统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
                    onValuesChange={(changedValues, allValues) => {statisticsProjectWorkItem(allValues)}}
                >
                    <Form.Item name="projectSetId"
                               label="项目集"
                               rules={[{ required: true }]}
                               style={{flex: '1 1 300px'}}
                    >
                        <Select
                            style={{ width: '100%', maxWidth: '250px' }}
                            placeholder="请选择项目集"
                        >
                            {
                                projectSetList && projectSetList.map(item => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className="project-workitem" >
                <div className="project-workitem-top">
                    <div className="project-workitem-title">
                        <div>
                            项目事项对比
                        </div>
                    </div>
                </div>

                <div className="project-workitem-content" id={`project-workitem`}>

                    {
                        projectSet ?
                            <ProjectEmpty description="请选择项目集~" />
                            : null
                    }
                </div>

            </div>
        </div>

    )
}

export default (observer(ProjectSetWorkItem));