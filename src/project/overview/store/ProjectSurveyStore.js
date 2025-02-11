/*
 * @Descripttion: 项目概况页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 17:05:45
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 16:42:11
 */
import { action, observable } from "mobx";
import { Service } from "../../../common/utils/requset"
export class ProjectSurveyStore {
    @observable recentList = [];
    @observable logList = [];

    @observable opLogTimeCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }

    /**
     * 获取不同事项状态的统计
     * @param {项目id} projectId 
     * @param {成员id} masterId 
     * @returns 
     */
    @action
    statWorkItemByBusStatus = async (projectId, masterId) => {
        // const params = new FormData();
        // params.append("projectId", projectId)
        // if (masterId) {
        //     params.append("masterId", masterId)
        // }
        const params = {
            projectIds: [projectId]
        }
        const data = await Service("/workItem/findWorkItemNumByQuickSearch", params)
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
     * 项目燃尽图
     * @param {项目id} projectId 
     * @returns 
     */
    @action
    findProjectBurnDowmChartPage = async (projectId) => {
        const params = {
            projectId: projectId,
            orderParams: [{
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
                pageSize: 10,
                currentPage: value.currentPage
            },
            orderParams: [{
                name: "createtime",
                orderType:"desc"
            }],
            bgroup: "kanass",
            assignUserId: value.userId,
            data: {
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
                pageSize: 10,
                currentPage: value.currentPage
            },
            bgroup: "kanass",
            data: {
                projectId: value.projectId
            }

        }
        const data = await Service("/oplog/findlogpage", params)
        if(data.code === 0){
            const dataList = data.data.dataList;
            let list = []
            if(value.currentPage === 1) {
                this.logList = []
            }
            if(dataList.length > 0){
                dataList.map(item => {
                    const date = item.createTime.slice(0, 10);
                    const time = item.createTime.slice(11, 15);
                    const list1 = this.logList.filter(dateItem => dateItem.date === date)
                    if(list1.length > 0){
                        this.logList.map(dateItem => {
                            if(dateItem.date === date){
                                dateItem.children.push(item)
                            }
                            return dateItem;
                        })
                    }else {
                        this.logList.push({
                            date: date,
                            children: [item]
                        })
                    }
                })
            }
            console.log(this.logList)
        }
        
        return data;
    }

    @action
    findLogPageByTime = async (value) => {
        Object.assign(this.opLogTimeCondition, value)
        const data = await Service("/oplog/findLogPageByTime", this.opLogTimeCondition);
        if (data.code === 0) {
            this.logList = data.data.dataList;
        }
    }

    @action
    findRecentPage = async (masterId) => {
        const params={
            orderParams: [{
                name: "recentTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            model: "workItem",
            masterId: masterId,
            projectId: JSON.parse(localStorage.getItem("project")).id
        }
        const data = await Service("/recent/findRecentListToModel", params)
        if(data.code === 0){
            this.recentList = data.data.slice(0,10);
        }
        return data;
    }

    // 更新点击时间
    @action
    updateRecent = async (value) => {
        const data = await Service("/recent/updateRecent", value)
        return data;
    }

    @action
    statisticsProjectTodoWorkByStatus = async (value) => {
        const params = new FormData();
        params.append("projectId", value.projectId)
        const data = await Service("/projectInsightReport/statisticsProjectTodoWorkByStatus", params)
        return data;
    }
}
export default new ProjectSurveyStore();