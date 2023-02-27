import {service} from "../../../common/utils/requset";

// 获取迭代路线图接口
export function CreateStage(data){
    return service.request({
        url: "/stage/createStage",
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

export function FindStageList(data){
    return service.request({
        url: "/stage/findStageListTree",
        method: "post",
        data 
    })
}

export function FindStage(data){
    return service.request({
        url: "/stage/findStage",
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

export function CreateStageWorkItem(data){
    return service.request({
        url: "/stageWorkItem/createStageWorkItem",
        method: "post",
        data 
    })
}

export function FindWorkItemListByStage(data){
    return service.request({
        url: "/stageWorkItem/findStageChildWorkItemAndStage",
        method: "post",
        data 
    })
}

export function DeleteStageWorkItem(data){
    return service.request({
        url: "/stageWorkItem/deleteStageWorkItemCondition",
        method: "post",
        data 
    })
}

export function UpdateStage(data){
    return service.request({
        url: "/stage/updateStage",
        method: "post",
        data 
    })
}

export function DeleteStage(data){
    return service.request({
        url: "/stage/deleteStage",
        method: "post",
        data 
    })
}