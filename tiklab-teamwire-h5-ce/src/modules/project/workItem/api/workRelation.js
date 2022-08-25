/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-23 13:47:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 13:36:24
 */
import {service} from "../../../../common/utils/requset";

//获取所有关联事项列表列表
export function WorkRelationList(data){
    return service.request({
        url: "/workItem/findWorkItemPage",
        method: "post",
        data 
    })
}
// 获取已添加关联事项列表列表
export function SelectWorkRelationList(data){
    return service.request({
        url: "/workRelate/findWorkRelateList",
        method: "post",
        data 
    })
}
// 添加关联事项列表
export function AddWorkRelation(data){
    return service.request({
        url: "/workRelate/createWorkRelate",
        method: "post",
        data 
    })
}
// 删除关联事项列表
export function DeleWorkRelation(data){
    return service.request({
        url: "/workRelate/deleteWorkRelate",
        method: "post",
        data 
    })
}
// 搜索关联事项列表
export function SearchWorkRelation(data){
    return serviceLoc.request({
        url: "/searchWorkRelation",
        method: "post",
        data 
    })
}

// 从未选择关联事项列表中查找关联事项列表
export function SearchAllWorkRelation(data){
    return serviceLoc.request({
        url: "/searchAllWorkRelation",
        method: "post",
        data 
    })
}