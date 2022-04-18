/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import {service} from "../../../common/utils/requset";

// 获取全部日志
export function FindAllWorkLog (data){
    return service.request({
        url: "/workLog/findAllWorkLog",
        method: "post",
        data 
    })
}

// 获取全部人员工时
export function PerWorkingHours(data){
    return service.request({
        url: "/workLog/perWorkingHours",
        method: "post",
        data 
    })
}

// 获取全部事项工时
export function FindMatterWorkingHours   (data){
    return service.request({
        url: "/workLog/findMatterWorkingHours ",
        method: "post",
        data 
    })
}