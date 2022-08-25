import {service} from "../../../../common/utils/requset";


export function GetWorkLogList(data){
    return service.request({
        url: "/workLog/findWorkLogPage",
        method: "post",
        data 
    })
}

export function AddWorkLog(data){
    return service.request({
        url: "/workLog/createWorkLog",
        method: "post",
        data 
    })
}

export function DeleteWorKLog(data){
    return service.request({
        url: "/workLog/deleteWorkLog ",
        method: "post",
        data 
    })
}

export function EditWorKLog (data){
    return service.request({
        url: "/workLog/updateWorkLog",
        method: "post",
        data 
    })
}

export function SearchWorKLog (data){
    return service.request({
        url: "/workLog/findWorkLog",
        method: "post",
        data 
    })
}
