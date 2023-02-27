/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:42:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 16:42:16
 */
import {service} from "../../common/utils/requset";

export function FindDynamicList(data){
    return service.request({
        url: "/dynamic/findDynamicList",
        method: "post",
        data 
    })
}

export function Findlogpage (data){
    return service.request({
        url: "/oplog/findlogpage",
        method: "post",
        data 
    })
}