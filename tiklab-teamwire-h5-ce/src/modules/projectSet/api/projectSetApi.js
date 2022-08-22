/*
 * @Descripttion: 首页api
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:02:38
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 10:15:20
 */
import {service} from "../../../common/utils/requset";

// 获取我的项目
export function FindProjectSetPage(data){
    return service.request({
        url: "/projectSet/findProjectSetPage",
        method: "post",
        data 
        
    })
}

// 查找所有用户
export function FindAllUser(data){
    return service.request({
        url: "/user/findAllUser",
        method: "post",
        data 
        
    })
}

export function AddproList(data){
    return service.request({
        url: "/projectSet/createProjectSet",
        method: "post",
        data 
        
    })
}

// 查找所有事项类型
export function FindAllProjectSetType(data){
    return service.request({
        url: "/projectType/findAllProjectSetType",
        method: "post",
        data 
        
    })
}