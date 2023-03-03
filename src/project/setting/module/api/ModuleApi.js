/*
 * @Descripttion: 模块接口数据
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 16:17:44
 */
import {service} from "../../../../common/utils/requset";

/**
 * 获取所有模块列表
 * @param {*} data 
 * @returns 
 */
export function Getmodule(data){
    return service.request({
        url: "/module/findAllModule",
        method: "post",
        data 
    })
}

/**
 * 根据项目id,模块名字查找
 * @param {*} data 
 * @returns 
 */
export function getModuleList(data){
    return service.request({
        url: "/module/findModuleList",
        method: "post",
        data 
    })
}

/**
 * 添加模块
 * @param {*} data 
 * @returns 
 */
export function Addmodule(data){
    return service.request({
        url: "/module/createModule ",
        method: "post",
        data 
    })
}

/**
 * 删除模块
 * @param {*} data 
 * @returns 
 */
export function Delemodule(data){
    return service.request({
        url: "/module/deleteModule",
        method: "post",
        data
    })
}

/**
 * 通过id搜索模块
 * @param {*} data 
 * @returns 
 */
export function SearchmoduleById(data){
    return service.request({
        url: "/module/findModule",
        method: "post",
        data
    })
}

/**
 * 编辑模块
 * @param {*} data 
 * @returns 
 */
export function EditmoduleById(data){
    return service.request({
        url: "/module/updateModule",
        method: "post",
        data 
    })
}

/**
 * 按分页查找模块
 * @param {*} data 
 * @returns 
 */
export function FindModulePage(data){
    return service.request({
        url: "/module/findModulePage ",
        method: "post",
        data
    })
}