import { observable, action } from "mobx";
import {SelectWorkChildList,AddWorkChild, DeleWorkChild,
    FindEpicSelectWorkItemList,FindSelectWorkItemList} from "../api/workChild";
export class WorkChild {
    @observable workChildList = [];
    @observable selectWorkChildList = [];
    @observable searchWorkChildName = [];
    @observable childWorkItem = []
    @observable total = 0;
    @observable childWorkItemTotal = 0;
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

    @observable searchSelectCondition = {
        sortParams: [{
            name: "title",
            orderType:"asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };


    @action
    setChildWorkItem = (value) => {
        this.childWorkItem = value
    }
    // 获取史诗下可添加的事项
    @action
    findEpicSelectWorkItemList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const data = await FindEpicSelectWorkItemList(this.searchCondition);
        if(data.code === 0){
            this.total = data.data.totalRecord;
        }
        return data;
    }

     // 获取其他事项类型下可添加的事项
    @action
    findSelectWorkItemList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const data = await FindSelectWorkItemList(this.searchCondition);
        if(data.code === 0){
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action 
    setWorkChildList = (value) => {
        this.workChildList = value;
    }
    //获取已选择子事项
    @action
	getWorkChildList = async(value) => {
        Object.assign(this.searchSelectCondition, {...value});
        const data = await SelectWorkChildList(this.searchSelectCondition);
        if(data.code === 0){
            this.childWorkItemTotal = data.data.totalRecord;
        }
        return data;
    }
    //添加已选择事项
    @action
	addWorkChild = (value) => {
        let params = {
            id: value.id,
            parentWorkItem: {
                id: value.parentWorkId || "nullstring"
            },
            project: {
                id: value.projectId
            }
        }
        return new Promise((resolve,reject)=>{
            AddWorkChild(params).then(response => {
                if(response.code=== 0){
                    this.getWorkChildList()
                }
                resolve()
            }).catch(error => {
                reject()
                console.log(error)
            })
        })
		
    }
    //添加已选择事项
    @action
	deleWorkChild = (value) => {
        let params = {
            id: value.id,
            parentWorkItem: {
                id: "nullstring"
            },
            project: {
                id: value.projectId
            }
        }
        return new Promise((resolve,reject)=> {
            DeleWorkChild(params).then(response => {
                if(response.code=== 0){
                    this.getWorkChildList()
                }
                resolve(response.code)
            }).catch(error => {
                reject(error)
            })
        })
		
    }
}
export const WORKCHILD_STORE = "workChild"