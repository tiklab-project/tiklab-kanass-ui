import {service} from "../../../../common/utils/requset";
// 获取事项状态列表
export function GetWorkPriorityList(data){
    return service.request({
        url: "/workPriority/findWorkPriorityPage",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
// 添加事项状态
export function AddWorkPriorityList(data){
    return service.request({
        url: "/workPriority/createWorkPriority",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//编辑事项状态
export function EditWorkPriorityList(data){
    return service.request({
        url: "/workPriority/updateWorkPriority",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据id查找事项状态
export function FindWorkPriorityListById(data){
    return service.request({
        url: "/workPriority/findWorkPriority",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据id删除事项状态
export function DeleteWorkPriorityList(data){
    return service.request({
        url: "/workPriority/deleteWorkPriority",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

