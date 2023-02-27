/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-07 09:16:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-19 16:25:38
 */
import {service} from "../../../common/utils/requset";

//获取所有用户列表
export function VersionList(data){
    return service.request({
        url: "/projectVersion/findVersionPage",
        method: "post",
        data 
    })
}

// 添加版本
export function AddVersion(data){
    return service.request({
        url: "/projectVersion/createVersion",
        method: "post",
        data 
    })
}

// 删除版本
export function DeleVersion(data){
    return service.request({
        url: "/projectVersion/deleteVersion",
        method: "post",
        data 
    })
}
// 搜索版本
export function SearchVersionById(data){
    return service.request({
        url: "/projectVersion/findVersion",
        method: "post",
        data 
    })
}

// 编辑版本
export function EditVersion(data){
    return service.request({
        url: "/projectVersion/updateVersion",
        method: "post",
        data 
    })
}

export function FindVersion(data){
    return service.request({
        url: "/projectVersion/findVersion",
        method: "post",
        data 
    })
}