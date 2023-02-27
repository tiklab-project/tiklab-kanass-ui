/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 17:05:09
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-22 17:05:09
 */
import {service} from "../../../common/utils/requset";

// 获取我的事项统计
export function StatWorkItemByBusStatus (data){
    return service.request({
        url: "/workItemStat/statProjectWorkItemByBusStatus",
        method: "post",
        data 
    })
}

// 获取我的迭代统计
export function StatProjectManageSprint (data){
    return service.request({
        url: "/workItemStat/statProjectManageSprint",
        method: "post",
        data 
    })
}

// 获取当前项目的信息
export function FindProject (data){
    return service.request({
        url: "/project/findProject ",
        method: "post",
        data 
    })
}

// 获取当前项目的信息
export function FindDynamicPage (data){
    return service.request({
        url: "/dynamic/findDynamicPage",
        method: "post",
        data 
    })
}

// 获取燃尽图信息
export function FindProjectBurnDowmChartPage (data){
    return service.request({
        url: "/projectBurnDowmChart/findProjectBurnDowmChartPage",
        method: "post",
        data 
    })
}

/**
 * 按分页查找里程碑
 * @param {*} data 
 * @returns 
 */
 export function FindMilestoneList(data){
    return service.request({
        url: "/milestone/findMilestoneList",
        method: "post",
        data
    })
}

//统计待办事项
export function StatProjectWorkItemProcess(data){
    return service.request({
        url: "/workItemStat/statProjectWorkItemProcess",
        method: "post",
        data 
    })
}


export function Findlogpage (data){
    return service.request({
        url: "/oplog/findlogpage",
        method: "post",
        data 
    })
}

//todotask
export function Findtodopage (data){
    return service.request({
        url: "/todo/findtodopage",
        method: "post",
        data 
    })
}