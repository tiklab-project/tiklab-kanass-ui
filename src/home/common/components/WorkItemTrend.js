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
import "./WorkItemTrend.scss";
import HomeStore from "../store/HomeStore";
import echarts from "../../../common/echarts/echarts"

const WorkItemTrend = (props) => {
    const { statisticsDayAllWorkItemCount } = HomeStore;
    const [chart, setChart] = useState(null)


    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        statisticsDayWorkItem()
        return;
    }, [])


    /**
     * 处理统计数据
     */
    const statisticsDayWorkItem = (value) => {

        const chartDom = document.getElementById(`workitem-trend`)
        statisticsDayAllWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const data = res.data;
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
                        data: xAxisData.slice(1, 8) 
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

    return (
        <Fragment>
            <div className="home-workitem-trend">
                <div className="home-workitem-trend-top">
                    <div className="home-workitem-trend-title">
                        事项趋势
                    </div>
                </div>
                <div className="home-workitem-trend-content" id={`workitem-trend`} />
            </div>
        </Fragment >

    )
}

export default observer(WorkItemTrend);