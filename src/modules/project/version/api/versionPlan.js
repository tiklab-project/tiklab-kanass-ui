import {service} from "../../../../common/utils/requset";
import '../../../../mock/mockdataVersionPlan';

//获取所有用户列表
export function VersionPlanList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data 
    })
}
// 获取已添加用户列表
export function SelectVersionPlanList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data 
    })
}
// 添加用户
export function UpdataWorkItem(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
    })
}
// 添加用户
// export function DeleVersionPlan(data){
//     return serviceLoc.request({
//         url: "/deleVersionPlanList",
//         method: "post",
//         data 
//     })
// }
// 搜索用户
export function SearchVersionPlan(data){
    return serviceLoc.request({
        url: "/searchVersionPlan",
        method: "post",
        data 
    })
}

// 从未选择用户中查找用户
export function SearchAllVersionPlan(data){
    return serviceLoc.request({
        url: "/searchAllVersionPlan",
        method: "post",
        data 
    })
}