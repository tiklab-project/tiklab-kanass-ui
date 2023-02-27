/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-25 11:42:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:16:21
 */
import {service} from "../../../common/utils/requset";

export function Search(data){
    return service.request({
        url: "/search/searchForTop",
        method: "post",
        data
    })
}

export function SearchSort(data){
    return service.request({
        url: "/search/searchForCount",
        method: "post",
        data
    })
}

export function SearchForPage(data){
    return service.request({
        url: "/search/searchForPage",
        method: "post",
        data
    })
}