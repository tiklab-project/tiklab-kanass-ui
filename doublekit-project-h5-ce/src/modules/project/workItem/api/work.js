/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:35:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:35:59
 */
import {service} from "../../../../common/utils/requset";

//按分页获取所有事项列表
export function FindWorkItemList(data){
    return service.request({
        url: "/workItem/findConditionWorkItemPage",
        method: "post",
        data 
    })
}