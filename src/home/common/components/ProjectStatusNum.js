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
import "./ProjectStatusNum.scss";
import HomeStore from "../store/HomeStore";
import * as echarts from 'echarts';

const ProjectStatusNum = (props) => {
    const { statisticsProjectByStatus } = HomeStore;
    const [projectStatistics, setProjectStatistics] = useState({})
    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        statisticsProjectByStatus().then(res => {
            if (res.code === 0) {
                setProjectStatistics(res.data)
            }
        })
        return;
    }, [])


    /**
     * 处理统计数据
     */
    const setStatisticsData = (value) => {
        const chartDom = document.getElementById(`new-work-trend`)

        statisticsProjectByStatus().then(res => {
            if (res.code === 0) {
                let myChart = echarts.init(chartDom);
                const data = res.data;
                const xData = [];
                const yData = [];
                xData.push("全部");
                yData.push(
                    {
                        value: data.total,
                        itemStyle: {
                            color: '#5470C6'
                        }
                    },
                );


                xData.push("进行中")
                yData.push({
                    value: data.progress,
                    itemStyle: {
                        color: '#91CC75'
                    }
                });

                xData.push("未完成")
                yData.push({
                    value: data.noend,
                    itemStyle: {
                        color: '#FAC858'
                    }
                });

                xData.push("逾期")
                yData.push({
                    value: data.overdue,
                    itemStyle: {
                        color: '#EE6666'
                    }
                })

                const option = {
                    xAxis: {
                        type: 'category',
                        data: xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: yData,
                            type: 'bar'
                        }
                    ]
                };

                myChart.setOption(option);
            }
        })
    }

    const data = [
        {
            id: "total",
            name: "全部",
            icon: "allwork",
            code: "total",
            color: "#59ADF8"
        },
        {
            id: "progress",
            name: "进行中",
            icon: "progress",
            code: "progress",
            color: "#52C41A"
        },
        {
            id: "noend",
            name: "未结束",
            icon: "endwork",
            code: "noend",
            color: "#FF9552"
        },
        {
            id: "overdue",
            name: "逾期",
            icon: "overdue",
            code: "overdue",
            color: "#F76E5C"
        }
    ]

    return (
        <Fragment>
            <div className="project-status-num">
                <div className="project-status-num-top">
                    <div className="project-status-num-title">
                        项目统计
                    </div>
                </div>
                {/* <div className="project-status-num-content" id={`new-work-trend`} /> */}
                <div className="project-status-num-content">
                    {
                        data && data.map(item => {
                            return <div
                                id={item.id}
                                className="project-status-num-content-box"
                                onClick={() => selectMenu(item.icon)}
                            >
                              
                                <div className="project-status-num-content-box-right">
                                    <div className="project-status-num-content-box-num" style={{color: item.color}}>{projectStatistics[item.id]}</div>
                                    <div className="project-status-num-content-box-name">{item.name}</div>
                                </div>

                            </div>
                        })
                    }

                </div>
            </div>
        </Fragment >

    )
}

export default observer(ProjectStatusNum);