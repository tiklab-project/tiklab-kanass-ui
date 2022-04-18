import {service} from "../../../../common/utils/requset";
import '../../../../mock/mockdataversion';

//获取所有用户列表
export function VersionList(data){
    return service.request({
        url: "/version/findVersionPage",
        method: "post",
        data 
    })
}
// 获取已添加用户列表
// export function SelectVersionList(data){
//     return serviceLoc.request({
//         url: "/selectVersionList",
//         method: "post",
//         data 
//     })
// }
// 添加用户
export function AddVersion(data){
    return service.request({
        url: "/version/createVersion",
        method: "post",
        data 
    })
}
// 添加用户
export function DeleVersion(data){
    return service.request({
        url: "/version/deleteVersion",
        method: "post",
        data 
    })
}
// 搜索版本
export function SearchVersionById(data){
    return service.request({
        url: "/version/findVersion",
        method: "post",
        data 
    })
}

// 从未选择用户中查找用户
export function EditVersion(data){
    return service.request({
        url: "/version/updateVersion",
        method: "post",
        data 
    })
}

export function FindVersion(data){
    return service.request({
        url: "/version/findVersion",
        method: "post",
        data 
    })
}