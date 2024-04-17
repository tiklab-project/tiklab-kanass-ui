import { observable, action } from "mobx";
import {Service} from "../../common/utils/requset";
export class WorkLogStore {
    @observable workLogList = [];
    @observable workLogDeatil = [];
    @observable PlanTime = "";
    @observable workId = ""

    @observable workLogPage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    //查找所有工时
    @action
    getWorkLogList = async(value,page) => {
        this.workId = value.workItemId;
        if(page){
            Object.assign(this.workLogPage, {...page})
        }
        let params = {
            workItemId: value.workItemId,
            orderParams: [{
                name: "work_date",
                orderType: "desc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.workLogPage.current
            }
        }
        const data = await Service("/workLog/findWorkLogPage", params)
        if(data.code=== 0){
            this.workLogList = data.data.dataList;
            this.workLogPage.total = data.data.totalRecord
        }
        return data;
    }

    //添加工时
    @action
    addWorkLog = async(value) => {
        const data = await Service("/workLog/createWorkLog", value)
        if(data.code === 0){
            this.getWorkLogList({workItemId:this.workId})
        }
        return data;
		
    }

    //删除工时
    @action
    deleteWorKLog = async(value) => {
        const param = new FormData()
        param.append("id", value)
        const data = await Service("/workLog/deleteWorkLog", param)
        if(data.code === 0){
            this.getWorkLogList({workItemId:this.workId})
        }
        return data;
    }

    //编辑工时
    @action
    editWorKLog = async(value) => {
        let params = {
            id: value.id,
            workItem: {
                id: value.workItem
            },
            worker: {
                id: value.worker
            },
            workDate: value.workDate,
            takeupTime: value.takeupTime,
            workContent: value.workContent
        }
        const data = await Service("/workLog/updateWorkLog", params)
        return data;
    }

    //查找工时
    @action
    searchWorKLog = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workLog/findWorkLog", params)
        if(data.code === 0){
            this.workLogDeatil = data.data;
        }
        return data.data
        
    }

    // 获取计划用时
    @action
    setPlanTime = (value) => {
        this.PlanTime = value
    }

    @action
    findWorkItemAndUsedTime = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItemAndUsedTime", params);
        return data;
    }

}

export default new WorkLogStore();