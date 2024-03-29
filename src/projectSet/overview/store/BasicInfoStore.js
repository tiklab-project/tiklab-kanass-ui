
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset"
export class BasicInfoStore {
    @observable opLogList = [];
    @observable todoTaskList = [];


    @observable projectPageParams = {
        orderParams: [{
            name: "projectName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;

    }
    
    @action
    statProjectSetWorkItemProcess = async (values) => {
        const params = new FormData();
        params.append("ids", values)
        const data = await Service("/workItemStat/statProjectWorkItem", params)
        return data;
    }



    //获取关联项目
    @action
    findPrecessProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams)
        this.projectRelevance = data.data
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
                projectId: value.projectId
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
                pageSize: 10,
                currentPage: 1
            },
            bgroup: "kanass",
            userId: value.userId,
            data: {
                projectId: value.projectId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
        return data;
    }

    @action
    findProjectList = async(values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams);
        return data;
    }

    @action
    findProjectSet = async(valuvaluees) => {
        const params = new FormData();
        params.append("id", value)
        const data = await Service("/projectSet/findProjectSet", params);
        return data;
    }

}

export default new BasicInfoStore();