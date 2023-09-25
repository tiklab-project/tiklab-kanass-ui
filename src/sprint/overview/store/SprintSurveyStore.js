/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-25 16:01:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-04 09:00:09
 */
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
class SprintSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];


    @action
	StatSprintProcessWorkItem = async(value) => {
        const params = new FormData();
        params.append("sprintId",value.sprintId)
        params.append("masterId",value.masterId)
        const data = await Service("/workItemStat/statSprintProcessWorkItem", value)
        return data;
    }

    @action
	statWorkItemByBusStatus = async(value) => {
        const params = new FormData();
        params.append("sprintId",value.sprintId)
        params.append("masterId",value.masterId)
        params.append("projectId",value.projectId)
        const data = await Service("/workItemStat/statProjectWorkItemByBusStatus", params)
        return data;
    }

    // 获取迭代基本信息
    @action
	FindSprint = async(value) => {
        const params = new FormData();
        params.append("id",value.sprintId)
        const data = await Service("/sprint/findSprint", params)
        return data;
    }

     // 燃尽图
    @action
    FindSprintBurnDowmChartPage = async(sprintId)=> {
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
                pageSize: 20,
                currentPage: 1
            },
            bgroup: "teamwire"
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
                pageSize: 20,
                currentPage: value.currentPage
            },
            orderParams: [{
                name: "createtime",
                orderType:"desc"
            }],
            bgroup: "teamwire",
            userId: value.userId,
            content: {
                sprintId: value.sprintId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
    }
      
}
export default new SprintSurveyStore();