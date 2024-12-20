/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:58:27
 * @Description: 项目集统计左侧导航
 */

import React from 'react';
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import StatisticsAside from '../../statistics/components/StatisticsAside';
const ProjectSetStatisticsAside = (props) => {
    const workReportList = [
        {
            key: "workItem",
            title: "事项字段统计",
            type: "workItem"
        },
        {
            key: "workBulidEnd",
            title: "事项创建与解决统计",
            type: 'bulidend',
        },
        {
            key: "workNewTrend",
            title: "事项新增趋势",
            type: 'newtrend',
        },
        {
            key: "workEndTrend",
            title: "事项完成趋势",
            type: 'endtrend'
        },
        {
            key: "workNewTotalTrend",
            title: "事项累计新建趋势",
            type: 'newtotaltrend'
        },
        {
            key: "workEndTotalTrend",
            title: "事项累计完成趋势",
            type: "endtotaltrend"
        }
    ]

    const logReportList = [
        {
            key: "logProjectUser",
            title: "日志项目成员统计",
            type: "logprojectuser"
        },
        {
            key: "logProjectWork",
            title: "日志项目事项统计",
            type: "logprojectwork"
        },
        {
            key: "logUserProject",
            title: "日志成员项目统计",
            type: "loguserproject"
        },
    ]


    return (<StatisticsAside workReportList= {workReportList} logReportList = {logReportList} workKey = "projectset-statistics" logKey = "projectsetlog-statistics"/>
    )
}

export default withRouter(observer(ProjectSetStatisticsAside));