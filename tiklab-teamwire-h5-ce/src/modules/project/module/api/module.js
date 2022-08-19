/*
 * @Descripttion: 里程碑接口数据
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-02 17:21:13
 */
import {service} from "../../../../common/utils/requset";

/**
 * 根据项目id,里程碑名字查找
 * @param {*} data 
 * @returns 
 */
export function FindModuleList(data){
    return service.request({
        url: "/module/findModuleList",
        method: "post",
        data 
    })
}

/**
 * 添加里程碑
 * @param {*} data 
 * @returns 
 */
export function CreateModule(data){
    return service.request({
        url: "/module/createModule ",
        method: "post",
        data 
    })
}

/**
 * 删除里程碑
 * @param {*} data 
 * @returns 
 */
export function DeleModule(data){
    return service.request({
        url: "/module/deleteModule",
        method: "post",
        data
    })
}

/**
 * 通过id搜索里程碑
 * @param {*} data 
 * @returns 
 */
export function SearchModuleById(data){
    return service.request({
        url: "/module/findModule",
        method: "post",
        data
    })
}

/**
 * 编辑里程碑
 * @param {*} data 
 * @returns 
 */
export function EditModuleById(data){
    return service.request({
        url: "/module/updateModule",
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