/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-11 16:07:26
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-14 21:41:03
 */
import {service,serviceLoc} from "../../../common/utils/requset";
export function GetPreAuthCode(data){
    return service.request({
        url: "/callback/getPreAuthCode",
        method: "post",
        data 
    })
}

export function GetUserinfo3rd(data){
    return service.request({
        url: "/callback/getUserinfo3rd",
        method: "post",
        data 
    })
}

