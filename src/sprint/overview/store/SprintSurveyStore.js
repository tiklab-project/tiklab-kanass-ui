/*
 * @Descripttion: 迭代概况页面接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-25 16:01:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 15:31:55
 */
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
class SprintSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];
    @observable opLogCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }

    @observable
    logList = [];

    @action
	StatSprintProcessWorkItem = async(value) => {
        const params = new FormData();
        params.append("sprintId",value.sprintId)
        params.append("masterId",value.masterId)
        const data = await Service("/workItemStat/statSprintProcessWorkItem", value)
        return data;
    }

    @action
	findWorkItemNumByQuickSearch = async(value) => {
        const params = {
            projectIds: [value.projectId],
            sprintId: value.sprintId
        }
        const data = await Service("/workItem/findWorkItemNumByQuickSearch", params)
        return data;
    }

    // 获取迭代基本信息
    @action
	findSprint = async(value) => {
        const params = new FormData();
        params.append("id",value.sprintId)
        const data = await Service("/sprint/findSprint", params)
        return data;
    }

     // 燃尽图
    @action
    findSprintBurnDowmChartPage = async(sprintId)=> {
        const params={
            sprintId: sprintId,
            orderParams: [{
                name: "recordTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await Service("/sprintBurnDowmChart/findSprintBurnDowmChartPage", params)
        return data;
    }

    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            orderParams: [{
                name: "create_time",
                orderType:"desc"
            }],
            data: {
                sprintId: value.sprintId
            },
            bgroup: "kanass"
        }
        const data = await Service("/oplog/findlogpage", params)
        if(data.code === 0) {
            this.opLogList = data.data.dataList
        }
        return data;
    }

    @action
    findtodopage = async(value)=> {
        const params={
            pageParam: {
                pageSize: value.pageSize,
                currentPage: value.currentPage
            },
            orderParams: [{
                name: "createtime",
                orderType:"desc"
            }],
            bgroup: "kanass",
            userId: value.userId,
            status: value.status,
            data: {
                sprintId: value.sprintId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
    }

    @action
    findSelectSprintList = async (values) => {
        const data = await Service("/sprint/findSelectSprintList", values)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    updateSprint = async(values) => {
        const data = await Service("/sprint/updateSprint", values)
        return data;
    }

    @action
    setOpLogCondition = (value) => {
        this.opLogCondition = extendObservable(this.opLogCondition, { ...value })
    }

    @action
    findLogpage = async (value) => {
        this.setOpLogCondition(value)
        const data = await Service("/oplog/findlogpage", this.opLogCondition);
        if (data.code === 0) {
            const dataList = data.data.dataList;
            this.opLogCondition.pageParam.totalPage = data.data.totalPage;
            this.opLogCondition.pageParam.total = data.data.totalRecord;
            this.logList = []
            if (dataList.length > 0) {
                dataList.map(item => {
                    const date = item.createTime.slice(0, 10);
                    const list1 = this.logList.filter(dateItem => dateItem.date === date)
                    if (list1.length > 0) {
                        this.logList.map(dateItem => {
                            if (dateItem.date === date) {
                                dateItem.children.push(item)
                            }
                            return dateItem;
                        })
                    } else {
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
        Object.assign(this.opLogCondition, value)
        const data = await Service("/oplog/findLogPageByTime", this.opLogCondition);
        if (data.code === 0) {
            this.logList = data.data.dataList;
        }
    }

}
export default new SprintSurveyStore();