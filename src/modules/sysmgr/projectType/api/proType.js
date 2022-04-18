import {service} from "../../../../common/utils/requset";
// 获取事项状态列表
export function GetProjectTypeList(data){
    return service.request({
        url: "/projectType/findProjectTypePage",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
// 添加事项状态
export function AddProjectTypeList(data){
    return service.request({
        url: "/projectType/createProjectType",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//编辑事项状态
export function EditProjectTypeList(data){
    return service.request({
        url: "/projectType/updateProjectType",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据id查找事项状态
export function FindProjectTypeListById(data){
    return service.request({
        url: "/projectType/findProjectType",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}
//根据id删除事项状态
export function DeleteProjectTypeList(data){
    return service.request({
        url: "/projectType/deleteProjectType",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

