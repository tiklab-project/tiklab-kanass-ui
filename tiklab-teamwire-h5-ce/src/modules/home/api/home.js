import {service} from "../../../common/utils/requset";

// 获取我的项目
export function StatProjectWorkItem (data){
    return service.request({
        url: "/workItemStat/statProjectWorkItem",
        method: "post",
        data 
    })
}