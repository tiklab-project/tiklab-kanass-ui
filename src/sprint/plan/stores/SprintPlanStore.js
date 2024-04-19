import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SprintPlanStore {
    @observable noPlanSprintWorkList = [];
    @observable planSprintWorkList = [];
    @observable sprintList = [];
    @observable searchCondition = {
        orderParams: [{
            name: "id",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };

    @observable noPlanSearchCondition = {
        orderParams: [{
            name: "id",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };
    @observable noPlanCurrent = 0;
    @observable planCurrent = 0;
    @observable noPlanTotal = 0;
    @observable planTotal = 0;
    @observable listType = null;

    @action
    setListType = (value) => {
        this.listType = value;
    }

    @action
    setNoPlanSearchCondition = (value) => {
        this.noPlanSearchCondition = extendObservable(this.noPlanSearchCondition,  { ...value })
    }

    @action
    setNoPlanSprintWorkList = (value) => {
        this.noPlanSprintWorkList = value;
    }

    @action
	getNoPlanWorkList = async(value) => {
        this.setNoPlanSearchCondition(value)
        const data = await Service("/workItem/findConditionWorkItemPage", this.noPlanSearchCondition)
		if(data.code=== 0){
            if(data.data.currentPage === 1){
                this.noPlanSprintWorkList = data.data.dataList;
            }else {
                this.noPlanSprintWorkList.push(...data.data.dataList);
            }
            
            this.noPlanTotal = data.data.totalPage;
        }
        return data;
    }
    @action
    setSearchCondition = (value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
    }

    @action
    setPlanSprintWorkList = (value) => {
        this.planSprintWorkList = value;
    }

    @action
	getWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findConditionWorkItemPage", this.searchCondition)
        if(data.code === 0){
            if(data.data.currentPage === 1){
                this.planSprintWorkList = data.data.dataList;
            }else {
                this.planSprintWorkList.push(...data.data.dataList);
            }
            this.planTotal = data.data.totalPage;
        }
		return data;
    }

    @action
	findSprintList = async(value) => {
        const params={
            projectId: value.projectId,
            orderParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/sprint/findSprintList", params)
        if(data.code=== 0){
            this.sprintList = data.data;
        }
        return data;
    }

    @action
	updateWorkItem = async(value) => {
        const params={
            id: value.startId,
            updateField: value.updateField,
            sprint: {
                id: value.endId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
	delSprint = async(value) => {
        const params={
            id: value.startId,
            updateField: value.updateField,
            sprint: {
                id: value.endId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
    haveChildren = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/haveChildren", params)
        return data;
    }

    @action
    findWorkItemAndChildrenIds = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItemAndChildrenIds", params)
        return data;
    }
}

export default new SprintPlanStore();