/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-25 16:01:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-04 09:00:09
 */
import { observable, action } from "mobx";
import { statSprintProcessWorkItem,statSprintWorkItemByBusStatus,findSprint,findSprintBurnDowmChartPage,Findlogpage, Findtodopage } from "../api/sprintSurveyApi";
export class SprintSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];


    @action
	StatSprintProcessWorkItem = async(value) => {
        const params = new FormData();
        params.append("sprintId",value.sprintId)
        params.append("masterId",value.masterId)
		const data = await statSprintProcessWorkItem(params);
        return data;
    }

    @action
	StatSprintWorkItemByBusStatus = async(value) => {
        const params = new FormData();
        params.append("sprintId",value.sprintId)
		const data = await statSprintWorkItemByBusStatus(params);
        return data;
    }

    // 获取迭代基本信息
    @action
	FindSprint = async(value) => {
        const params = new FormData();
        params.append("id",value.sprintId)
		const data = await findSprint(params);
        return data;
    }

     // 燃尽图
    @action
    FindSprintBurnDowmChartPage = async(sprintId)=> {
        const params={
            sprintId: sprintId,
            sortParams: [{
                name: "recordTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await findSprintBurnDowmChartPage(params);
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
        const data = await Findlogpage(params);
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
            bgroup: "teamwire",
            userId: value.userId
        }
        const data = await Findtodopage(params);
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
    }
      
}
export const SPRINTSURVEY_STORE = "sprintSurveyStore";