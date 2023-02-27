import { observable, action, extendObservable } from "mobx";
import {CreateEpic, FindDmUserPage, FindEpicList, FindEpic, FindWorkItemPageTreeByQuery, 
    CreateEpicWorkItem, FindWorkItemListByEpic, DeleteEpicWorkItem, UpdateEpic, DeleteEpic} from "../api/epic";

export class EpicStore {
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
	createEpic = async(param) => {
		const data = await CreateEpic(param);
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
    findEpicList = async(value) => {
        console.log(value)
        const data = await FindEpicList(value)
        if(data.code === 0){
            return data
        }
    }

    @action
    findEpic = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await FindEpic(params)
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
    createEpicWorkItem = async(value) => {
        const data = await CreateEpicWorkItem(value)
        if(data.code === 0){
            return data;
        }
    }
    
    @action
    findWorkItemListByEpic = async(value) => {
        const data = await FindWorkItemListByEpic(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    deleteEpicWorkItem = async(value) => {
        const data = await DeleteEpicWorkItem(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    updateEpic = async(value) => {
        const data = await UpdateEpic(value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    deleteEpic = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await DeleteEpic(params)
        if(data.code === 0){
            return data;
        }
    }

}
export const EPIC_STORE = "epicStore"