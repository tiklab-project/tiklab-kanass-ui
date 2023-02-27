import {service} from "../../../common/utils/requset";

export function FindSprintList(data){
    return service.request({
        url: "/sprint/findSprintList",
        method: "post",
        data 
    })
}

export function FindSprint(data){
    return service.request({
        url: "/sprint/findSprint",
        method: "post",
        data 
    })
}