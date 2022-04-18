import {service} from "../../../../common/utils/requset";


// 获取事项状态列表
export function GetWorkStatusList(data){
    return service.request({
        url: "/workStatus/findWorkStatusPage",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}


// 添加事项状态
export function AddWorkStatusList(data){
    return service.request({
        url: "/workStatus/createWorkStatus",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}


//编辑事项状态
export function EditWorkStatusList(data){
    return service.request({
        url: "/workStatus/updateWorkStatus",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}


//根据id查找事项状态
export function FindWorkStatusListById(data){
    return service.request({
        url: "/workStatus/findWorkStatus",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}


//根据id删除事项状态
export function DeleteWorkStatusList(data){
    return service.request({
        url: "/workStatus/deleteWorkStatus",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 移动状态顺序
export function Exchange(data){
    return service.request({
        url: "/workStatus/exchange",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

