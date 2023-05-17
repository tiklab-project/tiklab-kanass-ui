/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 17:05:45
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-02 09:58:09
 */
import { action, observable } from "mobx";
import { Service } from "../../../common/utils/requset"
export class ProjectSurveyStore {
    @observable recentList = [];
    /**
     * 获取不同事项状态的统计
     * @param {项目id} projectId 
     * @param {成员id} masterId 
     * @returns 
     */
    @action
    statWorkItemByBusStatus = async (projectId, masterId) => {
        const params = new FormData();
        params.append("projectId", projectId)
        if (masterId) {
            params.append("masterId", masterId)
        }
        const data = await Service("/workItemStat/statProjectWorkItemByBusStatus", params)
        return data;
    }

    /**
     * 统计我管理的项目下迭代
     * @param {*} value 
     * @returns 
     */
    @action
    statProjectManageSprint = async (value) => {
        const params = new FormData();
        params.append("masterId", value.masterId)
        params.append("projectId", value.projectId)
        const data = await Service("/workItemStat/statProjectManageSprint", params)
        return data;
    }

    /**
     * 根据id获取项目的信息
     * @param {*} projectId 
     * @returns 
     */
    @action
    findProject = async (projectId) => {
        const params = new FormData();
        params.append("id", projectId);
        const data = await Service("/project/findProjectAndWorkNum", params)
        return data;
    }

    /**
     * 获取项目的动态
     * @param {项目id} projectId 
     * @returns 
     */
    @action
    findDynamicPage = async (projectId) => {
        const params = {
            projectId: projectId,
            sortParams: [{
                name: "title",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 4,
                currentPage: 1
            }
        }
        const data = await Service("/dynamic/findDynamicPage", params)
        return data;
    }

    /**
     * 项目燃尽图
     * @param {项目id} projectId 
     * @returns 
     */
    @action
    findProjectBurnDowmChartPage = async (projectId) => {
        const params = {
            projectId: projectId,
            sortParams: [{
                name: "recordTime",
                orderType: "desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await Service("/projectBurnDowmChart/findProjectBurnDowmChartPage", params)
        return data;
    }

    /**
     * 获取项目下里程碑
     * @param {项目id} projectId 
     * @returns 
     */
    @action
    findMilestoneList = async (projectId) => {
        const params = {
            projectId: projectId
        }
        const data = await Service("/milestone/findMilestoneList", params)
        return data;
    }

    /**
     * 获取项目的进行中事项
     * @param {*} value 
     * @returns 
     */
    @action
    statProjectWorkItemProcess = async (value) => {
        const params = new FormData();
        params.append("projectId", value)
        const data = await Service("/workItemStat/statProjectWorkItemProcess", params)
        return data;
    }

    /**
     * 获取待办事项
     * @param {*} value 
     * @returns 
     */
    @action
    findtodopage = async (value) => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: value.currentPage
            },
            bgroup: "teamwire",
            userId: value.userId,
            content: {
                projectId: value.projectId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        return data;
    }

    /**
     * 获取日志列表
     * @param {*} value 
     * @returns 
     */
    @action
    findlogpage = async (value) => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: value.currentPage
            },
            bgroup: "teamwire",
            content: {
                projectId: value.projectId
            }

        }
        const data = await Service("/oplog/findlogpage", params)
        return data;
    }

    @action
    findRecentPage = async () => {
        const params={
            sortParams: [{
                name: "recentTime",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            projectId: JSON.parse(localStorage.getItem("project")).id
        }
        const data = await Service("/recent/findRecentPage", params)
        if(data.code === 0){
            this.recentList = data.data.dataList;
        }
        return data;
    }

    // 更新点击时间
    @action
    updateRecent = async (value) => {
        const data = await Service("/recent/updateRecent", value)
        return data;
    }
}
export const PROJECTSURVEY_STORE = "projectSurveyStore"