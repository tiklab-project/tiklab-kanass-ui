import {service} from "../../../common/utils/requset";

// 获取我的项目
export function StatisticsProjectOperateList (data){
    return service.request({
        url: "/projectInsightReportController/statisticsProjectOperateList",
        method: "post",
        data 
    })
}

export function StatisticsNewWorkItemCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsNewWorkItemCount",
        method: "post",
        data 
    })
}

//每日完成
export function StatisticsEndWorkItemCount(data){
    return service.request({
        url: "/projectInsightReportController/statisticsEndWorkItemCount",
        method: "post",
        data
    })
}




export function StatisticsPorcessWorkItemCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsPorcessWorkItemCount",
        method: "post",
        data 
    })
}

export function StatisticsNewBugCountList (data){
    return service.request({
        url: "/projectInsightReportController/statisticsNewBugCount",
        method: "post",
        data 
    })
}

export function StatisticsProcessBugCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsProcessBugCount",
        method: "post",
        data 
    })
}

export function StatisticsProjectUserCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsProjectUserCount",
        method: "post",
        data 
    })
}

export function StatisticsProjectWorkItemCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsProjectWorkItemCount",
        method: "post",
        data 
    })
}

export function StatisticsProjectOperate (data){
    return service.request({
        url: "/projectInsightReportController/statisticsProjectOperate",
        method: "post",
        data 
    })
}

export function StatisticsDayWorkItemCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsDayWorkItemCount",
        method: "post",
        data 
    })
}


export function StatisticsWorkItemStatusCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsWorkItemStatusCount",
        method: "post",
        data 
    })
}


export function StatisticsUserWorkItemCount (data){
    return service.request({
        url: "/projectInsightReportController/statisticsUserWorkItemCount",
        method: "post",
        data 
    })
}

export function FindAllProjectSet(data){
    return service.request({
        url: "/projectSet/findAllProjectSet",
        method: "post",
        data 
    })
}

export function FindAllProject(data){
    return service.request({
        url: "/project/findAllProject",
        method: "post",
        data 
    })
}

//添加仪表盘
export function CreateInsight(data){
    return service.request({
        url: "/insight/createInsight",
        method: "post",
        data 
    })
}

//获取文档列表
export function FindInsightList(data){
    return service.request({
        url: "/insight/findInsightList",
        method: "post",
        data 
    })
}

//编辑表单
export function UpdateInsight(data){
    return service.request({
        url: "/insight/updateInsight",
        method: "post",
        data
    })
}

//编辑表单
export function FindInsight(data){
    return service.request({
        url: "/insight/findInsight",
        method: "post",
        data
    })
}

//删除仪表盘
export function DeleteInsight(data){
    return service.request({
        url: "/insight/deleteInsight",
        method: "post",
        data
    })
}