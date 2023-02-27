/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:28:52
 */
import {service} from "../../../common/utils/requset";

//获取已规划规划事项
export function GetWorkItem(data){
    return service.request({
        url: "/workItem/findWorkItemPage",
        method: "post",
        data 
    })
}

// 获取未被选择的事项列表
export function FindUnPlanWorkItemPage(data){
    return service.request({
        url: "/workItem/findUnPlanWorkItemPage",
        method: "post",
        data 
    })
}

// 添加用户
export function CreatePlanWorkItem(data){
    return service.request({
        url: "/planWorkItem/createPlanWorkItem",
        method: "post",
        data 
    })
}

// 添加用户
export function DeletePlanWorkItem(data){
    return service.request({
        url: "/planWorkItem/deletePlanWorkItemCondition",
        method: "post",
        data 
    })
}
// 搜索用户
export function SearchPlanPlan(data){
    return serviceLoc.request({
        url: "/searchPlanPlan",
        method: "post",
        data 
    })
}

// 从未选择用户中查找用户
export function SearchAllPlanPlan(data){
    return serviceLoc.request({
        url: "/searchAllPlanPlan",
        method: "post",
        data 
    })
}

//获取事项类型
export function WorkType(data){
    return service.request({
        url: "/workTypeDm/findWorkTypeDmList",
        method: "post",
        data 
    })
}