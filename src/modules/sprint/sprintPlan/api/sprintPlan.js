import {service} from "../../../../common/utils/requset";

export function GetNoPlanWorkList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function GetWorkList(data){
    return service.request({
        url: "/workItem/findWorkItemList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function GetSprintList(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

export function SetSprint(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}