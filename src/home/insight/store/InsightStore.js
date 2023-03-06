import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset"
export class InsightStore {
    // 项目集id
    @observable 
    projectSetId = "";

    // 项目id
    @observable 
    projectId = "";

    // 仪表盘详情的报表列表
    @observable 
    reportList = { lg: []}

    /**
     * 设置仪表盘详情的报表列表
     * @param {仪表盘详情的报表列表} value 
     */
    @action
    setReportList = (value) => {
        this.reportList = value
    }

    /**
     * 给仪表盘添加报表
     * @param {报表的信息，位置，属性} value 
     */
    @action
    addReportList = (value) => {
        this.reportList.lg.push(value)
    }

    /**
     * 设置项目集id
     * @param {项目集id} value 
     */
    @action
    setProjectSetId = (value) => {
        this.projectSetId = value
    }

    /**
     * 设置项目id
     * @param {项目id} value 
     */
    @action
    setProjectId = (value) => {
        this.projectId = value
    }

    /**
     * 统计项目集的项目下事项进展
     * @param {项目集id} params 
     * @returns 
     */
    @action
	statisticsProjectOperateList = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReportController/statisticsProjectOperateList", value)
        return data;
    }

    /**
     * 统计新增事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsNewWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsNewWorkItemCount", params)
        return data;
    }

    /**
     * 统计完成事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsEndWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsEndWorkItemCount", params)
        return data;
    }

    /**
     * 统计进行中事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsPorcessWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsPorcessWorkItemCount", params)
        return data;
    }

    /**
     * 统计新增缺陷
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsNewBugCountList = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsNewBugCount", params)
        return data;
    }

    /**
     * 统计进行中缺陷
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsProcessBugCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsProcessBugCount", params)
        return data;
    }

    /**
     * 统计项目集的项目成员对比
     * @param {项目集id} params 
     * @returns 
     */
    @action
    statisticsProjectUserCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReportController/statisticsProjectUserCount", params)
        return data;
    }

    /**
     * 统计项目集的项目事项对比
     * @param {项目集id} params 
     * @returns 
     */
    @action
    statisticsProjectWorkItemCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReportController/statisticsProjectWorkItemCount", params)
        return data;
    }

    /**
     * 统计项目的事项进展
     * @param {} params 
     * @returns 
     */
    @action
    statisticsProjectOperate = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsProjectOperate", params)
        return data;
    }

    /**
     * 统计某个项目下事项单位时间（天，周，月，季，年）的新增，完成，剩余趋势
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsDayWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsDayWorkItemCount", params)
        return data;
    }

    /**
     * 统计某个项目下，各个状态的事项数量
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsWorkItemStatusCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsWorkItemStatusCount", params)
        return data;
    }

    /**
     * 统计某个项目下，统计成员的负责的事项对比
     * @param {项目id} params 
     * @returns 
     */
    @action
    statisticsUserWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReportController/statisticsUserWorkItemCount", params)
        return data;
    }   

    /**
     * 查找所有项目组
     */
    @action
    findAllProjectSet = async() => {
        const data = await Service("/projectSet/findAllProjectSet")
        return data;
    }

    /**
     * 查找所有项目
     * @returns 
     */
    @action
    findAllProject = async() => {
        const data = await Service("/project/findAllProject")
        return data;
    }

    /**
     * 创建仪表盘
     * @param {仪表盘详情} params 
     * @returns 
     */
    @action
    createInsight = async(params) => {
        const data = await Service("/insight/createInsight", params)
        return data;
    }

    /**
     * 按照条件查找仪表盘
     * @returns 
     */
    @action
    findInsightList = async() => {
        const params = {
            orderParams: [{
                name: "insightName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/insight/findInsightList", params)
        return data;
    }

    /**
     * 更新仪表盘
     * @param {仪表盘信息} params 
     * @returns 
     */
    @action
    updateInsight = async(params) => {
        const data = await Service("/insight/updateInsight", params)
        return data;
    }

    /**
     * 根据id查找仪表盘
     * @param {*} params 
     * @returns 
     */
    @action
    findInsight = async(params) => {
        const data = await Service("/insight/findInsight", params)
        return data;
    }

    /**
     * 删除仪表盘
     * @param {*} params 
     * @returns 
     */
    @action
    deleteInsight = async(params) => {
        const data = await Service("/insight/deleteInsight", params)
        return data;
    }
}

export const INSIGHT_STORE = "insightStore"