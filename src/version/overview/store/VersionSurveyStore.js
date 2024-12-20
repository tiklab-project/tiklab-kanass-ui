/*
 * @Descripttion: 版本接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-25 16:01:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:15:44
 */
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
class VersionSurveyStore {
    @observable opLogList = [];
    @observable todoTaskList = [];
    @observable userList = []
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
	findWorkItemNumByQuickSearch = async(value) => {
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

    @action
    updateVersion = async(values) => {
        const data = await Service("/projectVersion/updateVersion", values)
        return data;
    }

    @action
    findSelectVersionList = async(values) => {
        const data = await Service("/projectVersion/findSelectVersionList", values)
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
export default new VersionSurveyStore();