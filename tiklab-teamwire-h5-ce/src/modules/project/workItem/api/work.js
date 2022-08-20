/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:35:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:35:59
 */
import {service} from "../../../../common/utils/requset";

//按分页获取所有事项列表
export function FindWorkItemList(data){
    return service.request({
        url: "/workItem/findConditionWorkItemPage",
        method: "post",
        data 
    })
}

//获取优先级类型
export function FindAllWorkPriority(data){
    return service.request({
        url: "/workPriority/findAllWorkPriority ",
        method: "post",
        data 
    })
}
//获取事项类型
export function FindAllWorkType(data){
    return service.request({
        url: "/workType/findAllWorkType",
        method: "post",
        data 
    })
}
//获取事项状态
export function FindAllStateNode(data){
    return service.request({
        url: "/stateNode/findAllStateNode",
        method: "post",
        data 
    })
}

// 获取用户列表
export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}

//根据对象查询迭代列表
export function FindSprintList(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data 
    })
}

export function FindModuleList(data){
    return service.request({
        url: "/module/findModuleList",
        method: "post",
        data 
    })
}

export function Upload(data){
    return service.request({
        url: "/dfs/upload",
        method: "post",
        data 
    })
}

export function FindWorkAttachList(data){
    return service.request({
        url: "/workAttach/findWorkAttachList",
        method: "post",
        data 
    })
}

export function CreateWorkAttach(data){
    return service.request({
        url: "/workAttach/createWorkAttach",
        method: "post",
        data 
    })
}

//添加事项
export function AddWork(data){
    return service.request({
        url: "/workItem/createWorkItem",
        method: "post",
        data
    })
}

export function FindWorkItem(data){
    return service.request({
        url: "/workItem/findWorkItem",
        method: "post",
        data 
    })
}

//编辑事项
export function EditWork(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
    })
}

//获取事项节点
export function FindFlowDef(data){
    return service.request({
        url: "/flow/findFlowDef",
        method: "post",
        data 
    })
}

// 获取自定义状态列表
export function GetStateList (data){
    return service.request({
        url: "/stateNode/findToNodeList",
        method: "post",
        data 
    })
}