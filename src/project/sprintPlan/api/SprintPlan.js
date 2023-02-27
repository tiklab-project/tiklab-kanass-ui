/*
 * @Descripttion: 计划迭代接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-27 09:17:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 16:31:43
 */
import {service} from "../../../common/utils/requset";

/**
 * 获取没有规划的事项列表
 * @param {*} data 
 * @returns 
 */
export function GetNoPlanWorkList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data
    })
}

/**
 * 获取事项列表
 * @param {*} data 
 * @returns 
 */
export function GetWorkList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data
    })
}

/**
 * 获取迭代列表
 * @param {*} data 
 * @returns 
 */
export function GetSprintList(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data
    })
}

/**
 * 给事项分配迭代
 * @param {*} data 
 * @returns 
 */
export function SetSprint(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data
    })
}