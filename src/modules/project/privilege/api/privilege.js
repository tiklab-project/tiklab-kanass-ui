import {service} from "../../../../common/utils/requset";

// 初始化项目角色
export function InitPrijectRole(data){
    return service.request({
        url: "/dmPrjRole/initDmPrjRolesFromGlobal",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 删除项目角色
export function DelePrijectRole(data){
    return service.request({
        url: "dmPrjRole/deleteDmPrjRoles",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}