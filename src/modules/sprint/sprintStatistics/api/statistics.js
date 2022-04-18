/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-28 18:36:55
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-28 20:01:41
 */
import {service} from "../../../../common/utils/requset";
import "../../../../mock/mockdataStatics";

export function GetStaticsWorkList(data){
    return service.request({
        url: "/workItemStat/statSprintWorkItemByStatus",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function GetStaticsUserList(data){
    return service.request({
        url: "/workItemStat/statWorkItemByAssigner",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}