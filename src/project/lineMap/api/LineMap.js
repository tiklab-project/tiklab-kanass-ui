/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 09:29:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-27 09:29:33
 */
import {service} from "../../../common/utils/requset";

// 获取迭代路线图接口
export function FindSprintRoadMap(data){
    return service.request({
        url: "/roadMap/findSprintRoadMap",
        method: "post",
        data 
    })
}

// 获取版本路线图接口
export function FindVersionRoadMap(data){
    return service.request({
        url: "/roadMap/findVersionRoadMap",
        method: "post",
        data 
    })
}

// 获取史诗路线图接口
export function FindEpicRoadMap(data){
    return service.request({
        url: "/roadMap/findEpicRoadMap",
        method: "post",
        data 
    })
}