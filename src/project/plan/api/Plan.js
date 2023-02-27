/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:26:35
 */
import {service} from "../../../common/utils/requset";

//获取所有计划列表
export function PlanList(data){
    return service.request({
        url: "/plan/findPlanPageTree",
        method: "post",
        data 
    })
}

// 添加计划
export function AddPlan(data){
    return service.request({
        url: "/plan/createPlan",
        method: "post",
        data 
    })
}
// 添加计划
export function DelePlan(data){
    return service.request({
        url: "/plan/deletePlan",
        method: "post",
        data 
    })
}
// 搜索版本
export function SearchPlanById(data){
    return service.request({
        url: "/plan/findPlan",
        method: "post",
        data 
    })
}

// 从未选择计划中查找计划
export function EditPlan(data){
    return service.request({
        url: "/plan/updatePlan",
        method: "post",
        data 
    })
}

// 查找所有计划类型
export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}