/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 15:03:09
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-24 17:01:04
 */
import {service} from "../../common/utils/requset";

export function CreateWorkComment(data){
    return service.request({
        url: "/workComment/createWorkComment",
        method: "post",
        data 
    })
}

export function FindWorkCommentPage(data){
    return service.request({
        url: "/workComment/findWorkCommentPage",
        method: "post",
        data 
    })
}

export function UpdateWorkComment(data){
    return service.request({
        url: "/workComment/updateWorkComment",
        method: "post",
        data 
    })
}

export function DeleteWorkComment(data){
    return service.request({
        url: "/workComment/deleteWorkComment",
        method: "post",
        data 
    })
}