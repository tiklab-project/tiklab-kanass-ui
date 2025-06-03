/*
 * @Descripttion: 项目成员事项对比
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button } from 'antd';
import "./userWorkItem.scss";
import echarts from "../../../common/echarts/echarts"
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";


const UserWorkItem = (props) => {
    const { statisticsUserWorkItemCount, findAllProject, reportList } = StatisticsStore;
    // 统计条件的表单
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([])
    const [project, setProject] = useState(null)
    // 所有项目的列表
    const [projectList, setProjectList] = useState([]);
    const [chart, setChart] = useState(null)

    useEffect(() => {
        /**
         * 查找所有项目集并设置默认项目集
         */


        findAllProject().then(res => {
            setProjectList(res.data)
        })
        return;
    }, [])


    /**
     * 处理统计数据
     */
    const statisticsUserWorkItem = (data) => {
        const chartDom = document.getElementById(`user-workitem`)
        statisticsUserWorkItemCount(data).then(res => {
            if (res.code === 0) {
                const userList = res.data.userCount;
                setUserList(userList)
                const project = res.data.project;
                setProject(project)
                if (chart){
                    chart.clear();
                }
                if (project) {
                    const series = [];
                    const yAxisValue = [];
                    const seriesWorkItem = [];
                    const seriesDemand = [];
                    const seriesTask = [];
                    const seriesBug = [];

                    userList.map((item, index) => {
                        yAxisValue.push(item.user.nickname ? item.user.nickname : item.user.name)
                        seriesWorkItem.push(item.workItemTypeCount.workItem)
                        seriesDemand.push(item.workItemTypeCount.demand)
                        seriesTask.push(item.workItemTypeCount.task)
                        seriesBug.push(item.workItemTypeCount.bug)
                    })
                    series.push(
                        {
                            name: "demand",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesDemand
                        },
                        {
                            name: "task",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesTask
                        },
                        {
                            name: "bug",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesBug
                        },
                    )
                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
                    let option = {
                        title: {
                            text: res.data.project.projectName,
                            textStyle:{
                                fontWeight: "nomal",
                                overflow: 'break',  // 超出截断
                                width: res.data.project.projectName.length > 20 ? 140 : 'auto'             // 标题最大宽度（px
                            }
                        },
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

    const onValuesChange = (changedValues, allValues) => {
        statisticsUserWorkItem(allValues)
    }


    return (
        <div className="statistics">
            <div className="statistics-top">
                <div  className="statistics-work-title">项目成员事项统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onValuesChange={(changedValues, allValues) => onValuesChange(changedValues, allValues)}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
                >
                    <Form.Item name="projectId"
                               label="项目"
                               rules={[{ required: true }]}
                               style={{flex: '1 1 300px'}}
                    >
                        <Select
                            style={{ width: '100%', maxWidth: '250px' }}
                            placeholder="请选择项目"
                            rules={[{ required: true }]}
                        >
                            {
                                projectList && projectList.map(item => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <div className="user-workitem">
                <div className="user-workitem-top">
                    <div className="user-workitem-title">
                        <div>
                            项目的成员事项对比
                        </div>
                    </div>
                </div>
                {
                    <div className="user-workitem-content" id={`user-workitem`} >
                        {

                            !project && <ProjectEmpty description="请选择项目~" />

                        }
                    </div>
                }
            </div>
        </div>

    )
}

export default (observer(UserWorkItem));