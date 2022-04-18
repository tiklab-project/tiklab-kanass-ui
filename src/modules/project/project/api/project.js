/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-27 16:06:43
 */
import {service} from "../../../../common/utils/requset";
// import '../mock/mockdatapro.js';
// 请求接口
export function GetAllProList(data){
    return service.request({
        url: "/project/findAllProject",
        method: "post",
        data 
        
    })
}
// 请求接口
export function GetproList(data){
    return service.request({
        url: "/project/findProjectPage",
        method: "post",
        data 
        
    })
}
// 我创建的项目
export function FindMaterProjectList(data){
    return service.request({
        url: "/project/findMaterProjectList",
        method: "post",
        data 
        
    })
}

// 我参与的项目
export function FindJoinProjectList(data){
    return service.request({
        url: "/project/findJoinProjectList",
        method: "post",
        data 
        
    })
}

export function AddproList(data){
    return service.request({
        url: "/project/createProject",
        method: "post",
        data 
        
    })
}

export function DeleproList(data){
    return service.request({
        url: "/project/deleteProject",
        method: "post",
        data 
        
    })
}

export function UpdateproList(data){
    return service.request({
        url: "/project/updateProject",
        method: "post",
        data 
        
    })
}
export function SearchproList(data){
    return service.request({
        url: "/project/findProject",
        method: "post",
        data 
        
    })
}

export function Searchpro(data){
    return service.request({
        url: "/project/findProject",
        method: "post",
        data 
        
    })
}

// 查找所有事项类型
export function GetProjectTypeList(data){
    return service.request({
        url: "/projectType/findAllProjectType",
        method: "post",
        data 
        
    })
}

// 查找所有用户
export function GetUseList(data){
    return service.request({
        url: "/user/findAllUser",
        method: "post",
        data 
        
    })
}
//上传事项icon
export function GreatIcon(data){
    return service.request({
        url: "/icon/createIcon",
        method: "post",
        data 
        
    })
}

// 获取icon 列表
export function FindIconList (data){
    return service.request({
        url: "/icon/findIconList ",
        method: "post",
        data 
    })
}