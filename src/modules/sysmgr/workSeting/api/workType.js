import {service} from "../../../../common/utils/requset";
// 获取事项状态列表
export function GetWorkTypeList(data){
    return service.request({
        url: "/workType/findWorkTypePage",
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
export function EditWorkTypeList(data){
    return service.request({
        url: "/workType/updateWorkType",
        method: "post",
        data 
        
    })
}
//根据id查找事项状态
export function FindWorkTypeListById(data){
    return service.request({
        url: "/workType/findWorkType",
        method: "post",
        data 
        
    })
}
//根据id删除事项状态
export function DeleteWorkTypeList(data){
    return service.request({
        url: "/workType/deleteWorkType",
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


