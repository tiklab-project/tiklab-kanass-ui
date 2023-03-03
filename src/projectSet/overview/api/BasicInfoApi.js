import {service} from "../../../common/utils/requset";

// 查找所有用户类型
export function StatProjectSetSetWorkItemProcess(data){
    return service.request({
        url: "/workItemStat/statProgramSetWorkItemProcess",
        method: "post",
        data 
    })
}

export function FindDynamicPage (data){
    return service.request({
        url: "/dynamic/findDynamicPage",
        method: "post",
        data 
    })
}

export function FindProjectList (data){
    return service.request({
        url: "/projectSet/findProjectList",
        method: "post",
        data 
    })
}

//oplog
export function Findlogpage (data){
    return service.request({
        url: "/oplog/findlogpage",
        method: "post",
        data 
    })
}

//todotask
export function Findtodopage (data){
    return service.request({
        url: "/todo/findtodopage",
        method: "post",
        data 
    })
}