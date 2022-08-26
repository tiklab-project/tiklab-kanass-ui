import {service} from "../../../common/utils/requset";

// 获取我的项目
export function StatProjectWorkItem (data){
    return service.request({
        url: "/workItemStat/statProjectWorkItem",
        method: "post",
        data 
    })
}

//统计待办事项
export function StatWorkItemProcess(data){
    return service.request({
        url: "/workItemStat/statWorkItemProcess",
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