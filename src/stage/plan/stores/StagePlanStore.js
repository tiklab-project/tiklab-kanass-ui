import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class StagePlanStore {
    @observable noPlanWorkList = [];
    @observable planWorkList = [];
    @observable stageList = [];
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
        const data = await Service("/workItem/findConditionWorkItemPage", this.noPlanSearchCondition)
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
        this.planWorkList = value;
    }

    @action
	getWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findConditionWorkItemPage", this.searchCondition)
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
	findStageList = async(value) => {
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
        const data = await Service("/stage/findStageList", params)
        if(data.code=== 0){
            this.stageList = data.data;
        }
        return data;
    }

    @action
	setStage = async(value) => {
        const params={
            id: value.startId,
            updateField: "stage",
            stage: {
                id: value.endId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
    createStageWorkItem = async(value) => {
        const data = await Service("/stageWorkItem/createStageWorkItem", value);
        if(data.code === 0){
            return data;
        }
    }

    @action
	delStage = async(value) => {
        const params={
            id: value.startId,
            updateField: "stage",
            stage: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
    deleteStageWorkItemCondition = async(value) => {
        const data = await Service("/stageWorkItem/deleteStageWorkItemCondition", value);
        if(data.code === 0){
            return data;
        }
    }
}

export default new StagePlanStore();