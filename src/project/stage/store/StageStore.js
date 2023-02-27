import { observable, action, extendObservable } from "mobx";
import {CreateStage, FindDmUserPage, FindStageList, FindStage, FindWorkItemPageTreeByQuery, 
    CreateStageWorkItem, FindWorkItemListByStage, DeleteStageWorkItem, UpdateStage, DeleteStage} from "../api/StageApi";

export class StageStore {
    @observable uselist = [];
    @observable searchCondition = {
        orderParams: [{
            title: "标题",
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };

    @action
	createStage = async(param) => {
		const data = await CreateStage(param);
        return data;
    }

    @action
    getUseList = (value) => {
        const params = {
            domainId: value.projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        FindDmUserPage(params).then(response => {
            this.uselist = response.data.dataList;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    findStageList = async(value) => {
        const data = await FindStageList(value)
        if(data.code === 0){
            return data
        }
    }

    @action
    findStage = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await FindStage(params)
        if(data.code === 0){
            return data;
        }
    }

    @action
    findWorkItemPageTreeByQuery = async(value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
        const data = await FindWorkItemPageTreeByQuery(this.searchCondition)
        if(data.code === 0){
            return data;
        }
    }

    @action
    createStageWorkItem = async(value) => {
        const data = await CreateStageWorkItem(value)
        if(data.code === 0){
            return data;
        }
    }
    
    @action
    findWorkItemListByStage = async(value) => {
        const data = await FindWorkItemListByStage(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    deleteStageWorkItem = async(value) => {
        const data = await DeleteStageWorkItem(value)
        if(data.code === 0){
            return data;
        }
    }


    @action
    updataStageWorkItem = async(value) => {
        const data = await DeleteStageWorkItem(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    updateStage = async(value) => {
        const data = await UpdateStage(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    deleteStage = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await DeleteStage(params)
        if(data.code === 0){
            return data;
        }
    }

}
export const STAGE_STORE = "stageStore"