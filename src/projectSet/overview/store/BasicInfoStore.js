
import { observable, action } from "mobx";
import { StatProjectSetSetWorkItemProcess,FindDynamicPage, FindProjectList,Findlogpage, Findtodopage, } from "../api/basicInfoApi";

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
    statProjectSetWorkItemProcess = async (values) => {
        const params = new FormData();
        params.append("ids", values)
        const data = await StatProjectSetSetWorkItemProcess(params);
        return data;
    }

    @action
    findDynamicPage = async(value)=> {
        const params={
            projectIds: value.projectIds ? value.projectIds : null,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: value.pageSize,
                currentPage: 1
            }
        }
        const data = await FindDynamicPage(params);
        return data;
    }

    //获取关联项目
    @action
    findPrecessProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await FindProjectList(this.projectPageParams);
        this.projectRelevance = data.data.dataList
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
                currentPage: 1
            },
            bgroup: "teamwire",
            userId: value.userId
        }
        const data = await Findtodopage(params);
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
        return data;
    }
}

export const BASICINFO_STORE = "basicInfoStore"