/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-29 13:25:38
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-08 17:34:32
 */
import {service} from "../../../../common/utils/requset";

//获取所有知识库列表列表
export function FindDocumentPageByItemId(data){
    return service.request({
        url: "/workItemDocument/findDocumentPageByItemId",
        method: "post",
        data 
    })
}

export function FindDocumentList(data){
    return service.request({
        url: "/workItemDocument/findNotAssItemDocument",
        method: "post",
        data 
    })
}
//获取所有知识库列表列表
export function CreateWorkItemDocument(data){
    return service.request({
        url: "/workItemDocument/createWorkItemDocument",
        method: "post",
        data 
    })
}

// 请求接口
export function GetWikiAllList(data){
    return service.request({
        url: "/api/wiki/repository/findAllRepository",
        method: "post",
        data
    })
}

// 删除
export function DeleteWorkItemDocument(data){
    return service.request({
        url: "/workItemDocument/deleteWorkItemDocumentRele",
        method: "post",
        data
    })
}