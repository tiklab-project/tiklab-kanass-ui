import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SprintPlanStore {
    @observable noPlanWorkList = [];
    @observable planWorkList = [];
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
            orderType:"asc"
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

    @action
    setNoPlanSearchCondition = (value) => {
        this.noPlanSearchCondition = extendObservable(this.noPlanSearchCondition,  { ...value })
    }

    @action
    setNoPlanWorkList = (value) => {
        this.noPlanWorkList = value;
    }

    @action
	getNoPlanWorkList = async(value) => {
        this.setNoPlanSearchCondition(value)
        const data = await Service("/workItem/findWorkItemPage", this.noPlanSearchCondition)
		if(data.code=== 0){
            if(data.data.currentPage === 1){
                this.noPlanWorkList = data.data.dataList;
            }else {
                this.noPlanWorkList.push(...data.data.dataList);
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
    setPlanWorkList = (value) => {
        console.log(value)
        this.planWorkList = value;
    }

    @action
	getWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemPage", this.searchCondition)
        if(data.code === 0){
            if(data.data.currentPage === 1){
                this.planWorkList = data.data.dataList;
            }else {
                this.planWorkList.push(...data.data.dataList);
            }
            this.planTotal = data.data.totalPage;
        }
		return data;
    }

    @action
	getSprintList = async(value) => {
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
	setSprint = async(value) => {
        const params={
            id: value.startId,
            updateField: "sprint",
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
            updateField: "sprint",
            sprint: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }
}

export default new SprintPlanStore();