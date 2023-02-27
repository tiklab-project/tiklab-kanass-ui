import { observable, action } from "mobx";
import {StatisticsProjectOperateList, StatisticsNewWorkItemCount,StatisticsEndWorkItemCount,
    StatisticsPorcessWorkItemCount,StatisticsNewBugCountList, StatisticsProcessBugCount, StatisticsProjectUserCount, 
    StatisticsProjectWorkItemCount, StatisticsProjectOperate, StatisticsDayWorkItemCount,
    StatisticsWorkItemStatusCount,StatisticsUserWorkItemCount,FindAllProjectSet, FindAllProject,
    CreateInsight, FindInsightList, UpdateInsight, FindInsight, DeleteInsight
    } from "../api/insightApi"

export class InsightStore {
    @observable projectSetId = "";
    @observable projectId = "";
    @observable reportList = { lg: []}

    @action
    setReportList = (value) => {
        this.reportList = value
    }

    @action
    addReportList = (value) => {
        console.log(this.reportList)
        this.reportList.lg.push(value)
    }

    @action
    setProjectSetId = (value) => {
        this.projectSetId = value
    }

    @action
    setProjectId = (value) => {
        this.projectId = value
    }

    @action
	statisticsProjectOperateList = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
		const data = await StatisticsProjectOperateList(value);
        return data;
    }

    @action
	statisticsNewWorkItemCount = async(params) => {
		const data = await StatisticsNewWorkItemCount(params);
        return data;
    }

    @action
	statisticsEndWorkItemCount = async(params) => {
		const data = await StatisticsEndWorkItemCount(params);
        return data;
    }

    @action
	statisticsPorcessWorkItemCount = async(params) => {
		const data = await StatisticsPorcessWorkItemCount(params);
        return data;
    }

    @action
    statisticsNewBugCountList = async(params) => {
		const data = await StatisticsNewBugCountList(params);
        return data;
    }

    @action
    statisticsProcessBugCount = async(params) => {
		const data = await StatisticsProcessBugCount(params);
        return data;
    }

    @action
    statisticsProjectUserCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
		const data = await StatisticsProjectUserCount(value);
        return data;
    }

    @action
    statisticsProjectWorkItemCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
		const data = await StatisticsProjectWorkItemCount(value);
        return data;
    }

    @action
    statisticsProjectOperate = async(params) => {
		const data = await StatisticsProjectOperate(params);
        return data;
    }

    @action
    statisticsDayWorkItemCount = async(params) => {
		const data = await StatisticsDayWorkItemCount(params);
        return data;
    }

    @action
    statisticsWorkItemStatusCount = async(params) => {

		const data = await StatisticsWorkItemStatusCount(params);
        return data;
    }

    @action
    statisticsUserWorkItemCount = async(params) => {
        // const value = new FormData();
        // value.append("projectId", params.projectId)
		const data = await StatisticsUserWorkItemCount(params);
        return data;
    }

    @action
    findAllProjectSet = async() => {
		const data = await FindAllProjectSet();
        return data;
    }

    @action
    findAllProject = async() => {
		const data = await FindAllProject();
        return data;
    }

    @action
    createInsight = async(params) => {
		const data = await CreateInsight(params);
        return data;
    }

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
		const data = await FindInsightList(params);
        return data;
    }

    @action
    updateInsight = async(params) => {
		const data = await UpdateInsight(params);
        return data;
    }

    @action
    findInsight = async(params) => {
		const data = await FindInsight(params);
        return data;
    }

    @action
    deleteInsight = async(params) => {
        const data = await DeleteInsight(params);
        return data;
    }
}

export const INSIGHT_STORE = "insightStore"