/*
 * @Descripttion: 首页api
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:02:38
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-23 09:13:59
 */
import {service} from "../../../common/utils/requset";

// 获取我的项目
export function StatProjectWorkItem (data){
    return service.request({
        url: "/workItemStat/statProjectWorkItem",
        method: "post",
        data 
    })
}
// 获取我的事项统计
export function StatWorkItemByBusStatus (data){
    return service.request({
        url: "/workItemStat/statWorkItemByBusStatus",
        method: "post",
        data 
    })
}

// 获取我的迭代统计
export function ManageSprint (data){
    return service.request({
        url: "/workItemStat/statManageSprint",
        method: "post",
        data 
    })
}

// 获取所有事项分类
export function GetWorkType(data){
    return service.request({
        url: "/workType/findAllWorkType",
        method: "post",
        data 
    })
}

// 获取所有事项状态
export function FindWorkStatusListBySorts(data){
    return service.request({
        url: "/workStatus/findWorkStatusListBySorts",
        method: "post",
        data 
    })
}

//统计待办事项
export function StatWorkItemProcess(data){
    return service.request({
        url: "/todo/findtodopage",
        method: "post",
        data 
    })
}

//获取我的消息列表
export function FindMessageDispatchItemPage(data){
    return service.request({
        url: "/message/messageItem/findMessageItemPage",
        method: "post",
        data 
    })
}

// 动态
export function FindDynamicPage (data){
    return service.request({
        url: "/dynamic/findDynamicPage",
        method: "post",
        data 
    })
}

//最近点击
export function CreateRecent (data){
    return service.request({
        url: "/recent/createRecent",
        method: "post",
        data 
    })
}

//最近点击
export function FindRecentList (data){
    return service.request({
        url: "/recent/findRecentList",
        method: "post",
        data 
    })
}


export function UpdateMessageDispatchItem(data){
    return service.request({
        url: "/message/messageItem/updateMessageItem",
        method: "post",
        data 
    })
}

//oplog
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

// 请求接口
export function FindAllProject(data){
    return service.request({
        url: "/project/findAllProject",
        method: "post",
        data 
        
    })
}

// 请求接口
export function FindSprintList(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data 
        
    })
}

// 请求接口
export function FindProjectSetList(data){
    return service.request({
        url: "/projectSet/findProjectSetList",
        method: "post",
        data 
        
    })
}

export function FindProjectSetProjectList(data){
    return service.request({
        url: "/projectSet/findProjectList",
        method: "post",
        data 
    })
}

