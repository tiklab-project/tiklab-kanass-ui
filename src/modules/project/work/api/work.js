import {service} from "../../../../common/utils/requset";
//获取所有事项列表
export function WorkList(data){
    return service.request({
        url: "/workItem/findAllWorkItem",
        method: "post",
        data 
    })
}
//按分页获取所有事项列表
export function WorkListByPage(data){
    return service.request({
        url: "/workItem/findWorkItemPage",
        method: "post",
        data 
    })
}
//按分页获取所有事项列表树形
export function WorkListByPageTree(data){
    return service.request({
        url: "/workItem/findWorkItemPageTree",
        method: "post",
        data 
    })
}

//按分页获取所有事项列表树形
export function FindWorkItemPageTreeByQuery(data){
    return service.request({
        url: "/workItem/findWorkItemPageTreeByQuery",
        method: "post",
        data 
    })
}

//按分页获取所有事项列表
export function FindWorkItemList(data){
    return service.request({
        url: "/workItem/findConditionWorkItemPage",
        method: "post",
        data 
    })
}

//按分页获取所有事项列表树形,甘特图
export function WorkChildrenListByListTree(data){
    return service.request({
        url: "/workItem/findWorkItemListTree",
        method: "post",
        data 
    })
}

//按分页获取所有事项列表树形,子事项
export function WorkListByListTree(data){
    return service.request({
        url: "/workItemGantt/findWorkItemListTree",
        method: "post",
        data 
    })
}

// 根据查询对象查找事项看板列表 
export function WorkBoardList (data){
    return service.request({
        url: "/workItem/findWorkBoardList",
        method: "post",
        data 
    })
}

// 根据查询对象查找事项看板列表 
export function FindWorkUserGroupBoardList (data){
    return service.request({
        url: "/workItem/findWorkUserGroupBoardList",
        method: "post",
        data 
    })
}

//添加事项
export function AddWork(data){
    return service.request({
        url: "/workItem/createWorkItem",
        method: "post",
        data
    })
}
//根据id查找事项
export function SearchWorkById(data){
    return service.request({
        url: "/workItem/findWorkItem",
        method: "post",
        data 
    })
}

//查找事项
export function SearchWork(data){
    return service.request({
        url: "/workItem/findWorkItem",
        method: "post",
        data 
    })
}

//删除事项
export function DetWork(data){
    return service.request({
        url: "/workItem/deleteWorkItem",
        method: "post",
        data 
    })
}

//按条件查找事项
export function SearchWorkList(data){
    return service.request({
        url: "/workItem/findWorkItemPage",
        method: "post",
        data 
    })
}

//编辑事项
export function EditWork(data){
    return service.request({
        url: "/workItem/updateWorkItem",
        method: "post",
        data 
    })
}

//获取优先级类型
export function Priority(data){
    return service.request({
        url: "/workPriority/findAllWorkPriority ",
        method: "post",
        data 
    })
}
//获取事项类型
export function WorkType(data){
    return service.request({
        url: "/workType/findAllWorkType",
        method: "post",
        data 
    })
}
//获取事项状态
export function WorkStatus(data){
    return service.request({
        url: "/stateNode/findAllStateNode",
        method: "post",
        data 
    })
}

//获取事项节点
export function FindFlowDef(data){
    return service.request({
        url: "/flow/findFlowDef",
        method: "post",
        data 
    })
}
// 获取用户列表
export function FindDmUserPage(data){
    return service.request({
        url: "/dmUser/findDmUserPage",
        method: "post",
        data 
    })
}
// 上传文件
export function UploadFile(data){
    return service.request({
        url: "/dfs/upload",
        method: "post",
        data 
    })
}

// 获取事项附件
export function FindWorkAttachList(data){
    return service.request({
        url: "/workAttach/findWorkAttachList",
        method: "post",
        data 
    })
}

// 上传附件
export function CreateWorkAttach(data){
    return service.request({
        url: "/workAttach/createWorkAttach",
        method: "post",
        data 
    })
}

// 根据事项类型ID查找关联表单配置
export function FindFormConfig (data){
    return service.request({
        url: "/workType/findFormConfig",
        method: "post",
        data 
    })
}

// 获取自定义状态列表
export function FindWorkTypeIds (data){
    return service.request({
        url: "/workType/findWorkTypeIds",
        method: "post",
        data 
    })
}

// 获取自定义状态列表
export function GetStateList (data){
    return service.request({
        url: "/stateNode/findToNodeList",
        method: "post",
        data 
    })
}