/*
 * @Descripttion: 项目统计右侧菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:35:05
 */
import React from 'react';
import StatisticsAside from '../../statistics/components/StatisticsAside';
const ProjectStatisticsAsicde = (props) => {
    

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
    ]
    
    return (
       <StatisticsAside workReportList= {workReportList} logReportList = {logReportList} workKey = "work-statistics" logKey = "log-statistics"/>
    )
}

export default ProjectStatisticsAsicde;