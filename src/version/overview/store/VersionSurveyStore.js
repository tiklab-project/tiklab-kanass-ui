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
class VersionSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];
    @observable userList = []

    @action
	statWorkItemByBusStatus = async(value) => {
        const params = {
            projectIds: [value.projectId],
            versionId: value.versionId
        }
        const data = await Service("/workItem/findWorkItemNumByQuickSearch", params)
        return data;
    }


    @action
	StatVersionWorkItemByBusStatus = async(value) => {
        const params = new FormData();
        params.append("versionId",value.versionId)
        const data = await Service("/workItemStat/statVersionWorkItemByBusStatus", value)
        return data;
    }

    // 获取迭代基本信息
    @action
	findVersion = async(value) => {
        const params = new FormData();
        params.append("id",value.versionId)
        const data = await Service("/projectVersion/findVersion", params)
        return data;
    }

     // 燃尽图
    @action
    FindVersionBurnDowmChartPage = async(versionId)=> {
        const params={
            versionId: versionId,
            orderParams: [{
                name: "recordTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await Service("/versionBurnDowmChart/findVersionBurnDowmChartPage", params)
        return data;
    }

    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            bgroup: "kanass",
            data: {
                versionId: value.versionId
            }
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
            bgroup: "kanass",
            data: {
                versionId: value.versionId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
    }

    @action
    getUseList = async (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        if (data.code === 0) {
            this.userList = data.data.dataList;
        }
        return data;
    }
      
}
export default new VersionSurveyStore();