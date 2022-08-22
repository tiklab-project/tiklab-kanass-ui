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
export function FindSprintPage(data){
    return service.request({
        url: "/sprint/findSprintPage",
        method: "post",
        data 
    })
}

export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}

export function CreateSprint(data){
    return service.request({
        url: "/sprint/createSprint",
        method: "post",
        data
    })
}

export function FindSprint(data){
    return service.request({
        url: "/sprint/findSprint",
        method: "post",
        data
    })
}

export function UpdateSprint(data){
    return service.request({
        url: "/sprint/updateSprint",
        method: "post",
        data
    })
}