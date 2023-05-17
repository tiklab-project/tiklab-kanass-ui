import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SprintPlanStore {
    @observable noPlanWorkList = [];
    @observable planWorkList = [];
    @observable sprintList = [];
    @observable searchCondition = {
        sortParams: [{
            name: "title",
            orderType:"asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @observable noPlanSearchCondition = {
        sortParams: [{
            name: "title",
            orderType:"asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };
    @observable noPlanTotal = 0;


    @action
    setNoPlanSearchCondition = (value) => {
        this.noPlanSearchCondition = extendObservable(this.noPlanSearchCondition,  { ...value })
    }

    @action
	getNoPlanWorkList = async(value) => {
        this.setNoPlanSearchCondition(value)
        const data = await Service("/workItem/findWorkItemList", value)
		if(data.code=== 0){
            this.noPlanWorkList = data.data;
        }
        return data;
    }
    @action
    setSearchCondition = (value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
    }

    @action
	getWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemList", this.searchCondition)
        if(data.code === 0){
            this.planWorkList = data.data;
        }
		return data;
    }

    @action
	getSprintList = async(value) => {
        const params={
            projectId: value.projectId,
            sortParams: [{
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

export const SPRINTPLAN_STORE = "sprintPlanStore"