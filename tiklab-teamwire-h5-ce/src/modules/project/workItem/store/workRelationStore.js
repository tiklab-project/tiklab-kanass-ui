import { observable, action } from "mobx";
import {WorkRelationList,SelectWorkRelationList,AddWorkRelation,
        DeleWorkRelation,SearchWorkRelation,SearchAllWorkRelation} from "../api/workRelation";


export class WorkRelation {
    @observable workRelationList = [];
    @observable selectWorkRelationList = [];
    @observable searchWorkRelationName = [];
    @observable searchCondition = {
        currentPage: 1
    };
    @observable searchSelectCondition = {
        currentPage: 1
    };

    // 获取所有成员
    @action
	getWorkRelationList = (value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            projectId: this.searchCondition.projectId,
            workTypeId: this.searchCondition.workTypeId,
            title: this.searchCondition.title,
            idNotIn: this.searchCondition.idNotIn,
            sortParams: [{
                name: "name",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
		return new Promise((resolve,reject)=> {
            WorkRelationList(params).then(response => {
            // this.workRelationList = response.data.workRelationList;
                console.log(response)
                if(response.code=== 0){
                    this.workRelationList = response.data.dataList;
                }
                resolve()
            }).catch(error => {
                console.log(error)
            })
        })
        
    }

    //获取已选择人员
    @action
	getSelectWorkRelationList = (value) => {
        Object.assign(this.searchSelectCondition, {...value})
        const params={
            workItemId: this.searchSelectCondition.workItemId,
            title: this.searchSelectCondition.title,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchSelectCondition.currentPage
            }
        }
        return new Promise((resolve,reject)=>{
            SelectWorkRelationList(params).then(response => {
                if(response.code=== 0){
                    this.selectWorkRelationList = response.data;
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }


    //添加已选择人员
    @action
	addWorkRelation = (value) => {
        let params = {
            relateWorkItem: {
                id: value.id
            },
            workItem: {
                id: value.workItem
            }
        }
        return new Promise((resolve,reject)=>{
            
            AddWorkRelation(params).then(response => {
                
                // if(response.code=== 0){
                //     this.getSelectWorkRelationList()
                // }
                resolve()
            }).catch(error => {
                reject()
                console.log(error)
            })
        })
    }

    //添加已选择人员
    @action
	deleWorkRelation = (value) => {

        const params = new FormData()
        params.append("id", value)
        
		DeleWorkRelation(params).then(response => {
            if(response.code=== 0){
                this.getSelectWorkRelationList()
            }
        }).catch(error => {
            console.log(error)
        })
    }



    //搜索已选择人员
    @action
	searchWorkRelation = (params) => {
        this.searchWorkRelationName = params
		SearchWorkRelation(params).then(response => {
            this.selectWorkRelationList = response.data.selectWorkRelationList;
        }).catch(error => {
            console.log(error)
        })
    }
    //搜索已未选择人员
    @action
	searchAllWorkRelation = (params) => {
		SearchAllWorkRelation(params).then(response => {
            this.workRelationList = response.data.workRelationList;
        }).catch(error => {
            console.log(error)
        })
    }
}
export const WORKRELATION_STORE = "workRelation"