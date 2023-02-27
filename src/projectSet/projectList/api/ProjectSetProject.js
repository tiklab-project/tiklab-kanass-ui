/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-06 17:17:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 10:13:57
 */
import {service} from "../../../common/utils/requset";

// 查找所有用户类型
export function GetUseList(data){
    return service.request({
        url: "/user/user/findAllUser",
        method: "post",
        data 
    })
}

// 创建项目集
export function GreateProjectSet(data){
    return service.request({
        url: "/projectSet/createProjectSet",
        method: "post",
        data 
    })
}



// 按分页查找项目集
export function FindProjectSetList(data){
    return service.request({
        url: "/projectSet/findProjectSetList",
        method: "post",
        data 
    })
}

// 按分页查找项目集
export function FindProjectSetPage(data){
    return service.request({
        url: "/projectSet/findProjectSetPage",
        method: "post",
        data 
    })
}

// 删除项目集
export function DeleteProjectSet(data){
    return service.request({
        url: "/projectSet/deleteProjectSet",
        method: "post",
        data 
    })
}

// 按id查找项目
export function FindProjectSet(data){
    return service.request({
        url: "/projectSet/findProjectSet",
        method: "post",
        data 
    })
}

// 更新项目集
export function UpdateProjectSet(data){
    return service.request({
        url: "/projectSet/updateProjectSet",
        method: "post",
        data 
    })
}

// 根据查询对象查询项目集下面的项目列表树
export function FindProjectList(data){
    return service.request({
        url: "/projectSet/findProjectList",
        method: "post",
        data 
    })
}

// 根据查询对象查询项目集下面的项目列表树
export function FindProjectIsOrNotRe(data){
    return service.request({
        url: "/projectSet/findProjectIsOrNotRe",
        method: "post",
        data 
    })
}

// 删除关联事项
export function UpdateProject(data){
    return service.request({
        url: "/project/updateProject",
        method: "post",
        data 
    })
}

// 添加关联关系
export function AddRelevance(data){
    return service.request({
        url: "/projectSet/addRelevance ",
        method: "post",
        data 
    })
}

// 查找所有项目集
export function FindAllProjectSet(data){
    return service.request({
        url: "/projectSet/findAllProjectSet",
        method: "post",
        data 
    })
}