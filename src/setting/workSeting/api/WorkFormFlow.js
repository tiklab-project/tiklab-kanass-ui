import {service} from "../../../common/utils/requset";

// 获取表单
export function FindFormList (data){
    return service.request({
        url: "/form/findFormList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 获取流程
export function GetAllFlow (data){
    return service.request({
        url: "/flow/findFlowList",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}