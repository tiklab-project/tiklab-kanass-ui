import {action, extendObservable, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

class StageSurveyStore {
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
            // orderParams: [{
            //     name: "createtime",
            //     orderType:"desc"
            // }],
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
export default new StageSurveyStore();