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
    
    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        setStatisticsData()
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

    return (
        <Fragment>
            <div className="home-new-work-trend">
                <div className="home-new-work-trend-top">
                    <div className="home-new-work-trend-title">
                        项目统计
                    </div>
                </div>
                <div className="home-new-work-trend-content" id={`new-work-trend`} />
            </div>
        </Fragment >

    )
}

export default observer(ProjectStatusNum);