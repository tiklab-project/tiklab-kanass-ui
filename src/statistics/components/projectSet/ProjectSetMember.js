/*
 * @Descripttion: 项目集的项目成员对比
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import {Form, Select, Button, Empty, message} from 'antd';
import "./ProjectSetMember.scss";
import echarts from "../../../common/echarts/echarts"
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";


const ProjectSetMember = (props) => {
    const insightStore = StatisticsStore;
    const { statisticsProjectUserCount, findAllProjectSet, reportList } = insightStore;

    // 统计条件的表单
    const [form] = Form.useForm();
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    // 统计项目成员的列表
    const [projectUserList, setProjectUserList] = useState([])
    const [projectSet, setProjectSet] = useState({});
    const [chart, setChart] = useState(null)
    useEffect(() => {
        /**
         * 查找所有项目集并设置默认项目集
         */
        findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    useEffect(() => {
        if (chart) {
            chart.resize();
        }
        return null;
    }, [])
    /**
     * 处理统计数据
     */
    const statisticsProjectUser = (value) => {
        const chartDom = document.getElementById(`project-user`)
        statisticsProjectUserCount(value).then(res => {
            if (res.code === 0) {
                const projectUserList = res.data.projectUserCountList;
                const projectSet = res.data.projectSet;
                setProjectSet(projectSet)
                setProjectUserList(projectUserList)
                if (projectSet ) {
                    const axisValue = []
                    const yAxisValue = []
                    if (projectUserList.length === 0){
                        axisValue.push("")
                        yAxisValue.push(0)
                        message.error("当前项目集下无项目")
                    }else {
                        projectUserList.map(item => {
                            axisValue.push(item.project.projectName)
                            yAxisValue.push(item.count)
                        })
                    }

                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
                    let option = {
                        title: {
                            text: projectSet.name,
                            textStyle:{
                                fontWeight: "nomal"
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
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
                            type: 'value',
                            boundaryGap: [0, 1]
                        },
                        yAxis: {
                            type: 'category',
                            data: axisValue
                        },
                        series: [
                            {
                                name: '项目成员',
                                type: 'bar',
                                data: yAxisValue
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            }
        })
    }

    const onValuesChange = (changeValue, allValues) => {
        statisticsProjectUser(allValues)
    }

    return (
        <div className="statistics">
            <div className="statistics-top">
                <div className="statistics-work-title">项目成员统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
                    onValuesChange={(changedValues, allValues) => {onValuesChange(changedValues, allValues)}}
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
            <div className="projectset-user">
                <div className="projectset-user-top">
                    <div className="projectset-user-title">
                        <div>
                            项目成员对比
                        </div>
                    </div>
                </div>
                <div className="projectset-user-content" id={`project-user`}>
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

export default (observer(ProjectSetMember));