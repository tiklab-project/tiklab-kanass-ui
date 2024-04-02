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
class StageSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];

    @action
	StatStageProcessWorkItem = async(value) => {
        const params = new FormData();
        params.append("stageId",value.stageId)
        params.append("masterId",value.masterId)
        const data = await Service("/workItemStat/statStageProcessWorkItem", value)
        return data;
    }

    @action
	findWorkItemNumByQuickSearch = async(value) => {
        const params = {
            projectIds: [value.projectId],
            stageId: value.stageId
        }
        const data = await Service("/workItem/findWorkItemNumByQuickSearch", params)
        return data;
    }

    // 获取迭代基本信息
    @action
	findStage = async(value) => {
        const params = new FormData();
        params.append("id",value.stageId)
        const data = await Service("/stage/findStage", params)
        return data;
    }

     // 燃尽图
    @action
    findStageBurnDowmChartPage = async(stageId)=> {
        const params={
            stageId: stageId,
            orderParams: [{
                name: "recordTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await Service("/stageBurnDowmChart/findStageBurnDowmChartPage", params)
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
                stageId: value.stageId
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
                stageId: value.stageId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
    }

    @action
    findSelectStageList = async (values) => {
        const data = await Service("/stage/findSelectStageList", values)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    updateStage = async(values) => {
        const data = await Service("/stage/updateStage", values)
        return data;
    }

}
export default new StageSurveyStore();