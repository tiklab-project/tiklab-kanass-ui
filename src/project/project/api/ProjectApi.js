/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-27 16:06:43
 */
import {service} from "../../../common/utils/requset";

// 请求接口
export function GetAllProList(data){
    return service.request({
        url: "/project/findAllProject",
        method: "post",
        data 
        
    })
}
// 请求接口
export function FindProjectList(data){
    return service.request({
        url: "/project/findProjectList",
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

export function FindRecentProjectPage(data){
    return service.request({
        url: "/project/findRecentProjectPage",
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
        url: "/user/user/findAllUser",
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
        url: "/icon/findIconList",
        method: "post",
        data 
    })
}

//最近点击
export function CreateRecent (data){
    return service.request({
        url: "/recent/createRecent",
        method: "post",
        data 
    })
}

//收藏
export function CreateProjectFocus (data){
    return service.request({
        url: "/projectFocus/createProjectFocus",
        method: "post",
        data 
    })
}

//收藏
export function FindProjectFocusList (data){
    return service.request({
        url: "/projectFocus/findProjectFocusList",
        method: "post",
        data 
    })
}

//取消收藏
export function DeleteProjectFocusByQuery (data){
    return service.request({
        url: "/projectFocus/deleteProjectFocusByQuery",
        method: "post",
        data 
    })
}

export function FindFocusProjectList(data){
    return service.request({
        url: "/project/findFocusProjectList",
        method: "post",
        data 
        
    })
}
// 获取我的项目
export function StatProjectWorkItem (data){
    return service.request({
        url: "/workItemStat/statProjectWorkItem",
        method: "post",
        data 
    })
}