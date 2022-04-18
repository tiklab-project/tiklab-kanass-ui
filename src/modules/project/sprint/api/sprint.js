/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-13 11:29:37
 */
import {service} from "../../../../common/utils/requset";
// import '../../mock/mockdatasprint.js';
// 请求接口
export function GetsprintList(data){
    return service.request({
        url: "/sprint/findAllSprint",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据对象查询迭代列表按分页
export function GetSprint(data){
    return service.request({
        url: "/sprint/findSprintPage",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据对象查询迭代列表
export function GetsprintAll(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
export function AddsprintList(data){
    return service.request({
        url: "/sprint/createSprint",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function DelesprintList(data){
    return service.request({
        url: "/sprint/deleteSprint ",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function SearchsprintList(data){
    return service.request({
        url: "/sprint/findSprint",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function EditsprintList(data){
    return service.request({
        url: "/sprint/updateSprint",
        method: "post",
        data
    })
}


// 查找所有用户类型
export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}

// 查找迭代状态列表
export function FindAllSprintState(data){
    return service.request({
        url: "/sprintState/findAllSprintState",
        method: "post",
        data 
    })
}
