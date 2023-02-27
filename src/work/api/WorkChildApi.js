/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-23 14:54:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-13 10:02:27
 */
import {service} from "../../common/utils/requset";


// 获取史诗下可添加的事项
export function FindEpicSelectWorkItemList(data){
    return service.request({
        url: "/workItem/findEpicSelectWorkItemList",
        method: "post",
        data 
    })
}

// 获取缺陷，任务，需求下可添加的事项
export function FindSelectWorkItemList(data){
    return service.request({
        url: "/workItem/findSelectWorkItemList",
        method: "post",
        data 
    })
}
// 获取已添加事项列表
export function SelectWorkChildList(data){
    return service.request({
        url: "/workItem/findWorkItemPage",
        method: "post",
        data 
    })
}
// 添加子任务
export function AddWorkChild(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
    })
}
// 
export function DeleWorkChild(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
    })
}