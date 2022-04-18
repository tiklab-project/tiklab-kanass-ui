/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-25 16:01:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-25 16:01:25
 */
import {service} from "../../../../common/utils/requset";

// 获取我的事项统计
export function statSprintProcessWorkItem (data){
    return service.request({
        url: "/workItemStat/statSprintProcessWorkItem",
        method: "post",
        data 
    })
}

// 获取我的进行中的事项统计
export function statSprintWorkItemByBusStatus (data){
    return service.request({
        url: "/workItemStat/statSprintWorkItemByBusStatus",
        method: "post",
        data 
    })
}

// 获取迭代基本信息
export function findSprint (data){
    return service.request({
        url: "/sprint/findSprint",
        method: "post",
        data 
    })
}

// 获取迭代基本信息
export function findSprintBurnDowmChartPage (data){
    return service.request({
        url: "/sprintBurnDowmChart/findSprintBurnDowmChartPage",
        method: "post",
        data 
    })
}