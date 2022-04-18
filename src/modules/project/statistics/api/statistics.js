/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:05:54
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 13:29:46
 */
import {service} from "../../../../common/utils/requset";
import "../../../../mock/mockdataStatics";

export function GetStaticsWorkList(data){
    return service.request({
        url: "/workItemStat/statWorkItemByStatus ",
        method: "post",
        data
    })
}

export function GetStaticsUserList(data){
    return service.request({
        url: "/workItemStat/statWorkItemByAssigner",
        method: "post",
        data
    })
}

// 添加报表
export function CreateReport(data){
    return service.request({
        url: "/report/createReport",
        method: "post",
        data
    })
}

// 查找所有报表
export function FindReportList(data){
    return service.request({
        url: "/report/findReportList",
        method: "post",
        data
    })
}

// 获取报表数据
export function FindReport(data){
    return service.request({
        url: "/report/findReport",
        method: "post",
        data
    })
}

// 获取统计数据
export function StatisticWorkItem(data){
    return service.request({
        url: "/statistic/statisticWorkItem",
        method: "post",
        data
    })
}

// 删除报告
export function DeleteReport(data){
    return service.request({
        url: "/report/deleteReport",
        method: "post",
        data
    })
}

// 获取统计数据
export function StatisticBuildAndEndWorkItem(data){
    return service.request({
        url: "/statistic/statisticBuildAndEndWorkItem",
        method: "post",
        data
    })
}

// 更新报表时间
export function UpdateReport(data){
    return service.request({
        url: "/report/updateReport",
        method: "post",
        data
    })
}