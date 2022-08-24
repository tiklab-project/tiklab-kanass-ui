import {service} from "../../../common/utils/requset";

// 根据id 查找目录的第一级文档
export function FindUser(data){
    return service.request({
        url: "/user/findUser",
        method: "post",
        data
    })
}

export function FindAllProjectType(data){
    return service.request({
        url: "/projectType/findAllProjectType",
        method: "post",
        data 
    })
}

export function FindAllWorkPriority(data){
    return service.request({
        url: "/workPriority/findAllWorkPriority",
        method: "post",
        data 
    })
}

export function FindAllWorkType(data){
    return service.request({
        url: "/workType/findAllWorkType",
        method: "post",
        data 
    })
}