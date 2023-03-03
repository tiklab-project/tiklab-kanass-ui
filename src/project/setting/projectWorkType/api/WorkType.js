import {service} from "../../../../common/utils/requset";

// 获取事项状态列表
export function GetWorkTypeList(data){
    return service.request({
        url: "/workType/findWorkTypeList",
        method: "post",
        data 
        
    })
}

// 获取事项状态列表
export function CreateWorkTypeDm(data){
    return service.request({
        url: "/workTypeDm/createWorkTypeDm",
        method: "post",
        data 
        
    })
}

// 获取事项状态列表
export function FindWorkTypeDmList(data){
    return service.request({
        url: "/workTypeDm/findWorkTypeDmList",
        method: "post",
        data 
        
    })
}

export function FindSelectWorkTypeDmList(data){
    return service.request({
        url: "/workType/findWorkTypeList",
        method: "post",
        data 
        
    })
}
// 添加事项状态
export function AddWorkTypeList(data){
    return service.request({
        url: "/workType/createWorkType",
        method: "post",
        data 
        
    })
}
//编辑事项状态
export function UpdateWorkTypeDm(data){
    return service.request({
        url: "/workTypeDm/updateWorkTypeDm",
        method: "post",
        data 
        
    })
}
//根据id查找事项状态
export function FindWorkTypeDm(data){
    return service.request({
        url: "/workTypeDm/findWorkTypeDm",
        method: "post",
        data 
        
    })
}
//根据id删除事项状态
export function DeleteWorkType(data){
    return service.request({
        url: "/workTypeDm/deleteWorkTypeDm",
        method: "post",
        data 
        
    })
}

//上传事项icon
export function GreatIcon(data){
    return service.request({
        url: "/icon/createIcon",
        method: "post",
        data 
        
    })
}

//查看事项icon
export function FindIconList (data){
    return service.request({
        url: "/icon/findIconList ",
        method: "post",
        data 
    })
}

export function FindDmFormList (data){
    return service.request({
        url: "/dmForm/findDmFormList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 获取流程
export function FindDmFlowPage (data){
    return service.request({
        url: "/dmFlow/findDmFlowPage",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}


