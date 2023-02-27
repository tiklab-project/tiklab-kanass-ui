/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import {service} from "../../../common/utils/requset";

// 获取全部工时
export function FindAllWorkLog (data){
    return service.request({
        url: "/workLog/findAllWorkLog",
        method: "post",
        data 
    })
}

export function FindWorkLog (data){
    return service.request({
        url: "/workLog/findWorkLog",
        method: "post",
        data 
    })
}

// 分页获取工时
export function FindWorkLogPage (data){
    return service.request({
        url: "/workLog/findWorkLogPage",
        method: "post",
        data 
    })
}

// 获取全部人员工时
export function FindProjectUserLog(data){
    return service.request({
        url: "/workLog/findProjectUserLog",
        method: "post",
        data 
    })
}

// 获取全部人员工时
export function FindProjectWorkItemLog(data){
    return service.request({
        url: "/workLog/findProjectWorkItemLog",
        method: "post",
        data 
    })
}

// 获取全部事项工时
export function FindUserProjectLog(data){
    return service.request({
        url: "/workLog/findUserProjectLog ",
        method: "post",
        data 
    })
}

export function FindAllUser(data){
    return service.request({
        url: "/user/user/findAllUser",
        method: "post",
        data 
    })
}

export function FindWorkItemList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data 
    })
}

export function AddWorkLog(data){
    return service.request({
        url: "/workLog/createWorkLog",
        method: "post",
        data 
    })
}

export function UpdateWorkLog(data){
    return service.request({
        url: "/workLog/updateWorkLog",
        method: "post",
        data 
    })
}