import {service} from "../../../common/utils/requset";

// 获取迭代路线图接口
export function CreateEpic(data){
    return service.request({
        url: "/epic/createEpic",
        method: "post",
        data 
    })
}

// 
export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}

export function FindEpicList(data){
    return service.request({
        url: "/epic/findEpicListTree",
        method: "post",
        data 
    })
}

export function FindEpic(data){
    return service.request({
        url: "/epic/findEpic",
        method: "post",
        data 
    })
}

export function FindWorkItemPageTreeByQuery(data){
    return service.request({
        url: "/workItem/findWorkItemListTree",
        method: "post",
        data 
    })
}

export function CreateEpicWorkItem(data){
    return service.request({
        url: "/epicWorkItem/createEpicWorkItem",
        method: "post",
        data 
    })
}

export function FindWorkItemListByEpic(data){
    return service.request({
        url: "/epicWorkItem/findEpicChildWorkItemAndEpic",
        method: "post",
        data 
    })
}

export function DeleteEpicWorkItem(data){
    return service.request({
        url: "/epicWorkItem/deleteEpicWorkItemCondition",
        method: "post",
        data 
    })
}

export function UpdateEpic(data){
    return service.request({
        url: "/epic/updateEpic",
        method: "post",
        data 
    })
}

export function DeleteEpic(data){
    return service.request({
        url: "/epic/deleteEpic",
        method: "post",
        data 
    })
}