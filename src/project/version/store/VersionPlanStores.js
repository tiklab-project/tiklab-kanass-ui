import { observable, action } from "mobx";
import {VersionPlanList,SelectVersionPlanList,UpdataWorkItem,SearchVersionPlan,SearchAllVersionPlan} from "../api/VersionPlan";
export class VersionPlanStore {
    @observable versionPlanList = [];
    @observable selectVersionPlanList = [];
    @observable searchVersionPlanName = [];
    @observable searchCondition = {
        currentPage: 1
    };
    @observable searchSelectCondition = {
        currentPage: 1
    };

    // 获取所有版本规划
    @action
	getVersionPlanList = (value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            projectId: this.searchCondition.projectId,
            title: this.searchCondition.title,
            workTypeId: this.searchCondition.workTypeId,
            versionIdIsNull: true,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        return new Promise((resolve,reject)=>{
            VersionPlanList(params).then(response => {
                this.versionPlanList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }


    //获取已选择规划事项
    @action
	getSelectVersionPlanList = (value) => {
        if(value){
            Object.assign(this.searchSelectCondition, {...value})
        }
        const params={
            projectId: this.searchSelectCondition.projectId,
            versionId: this.searchSelectCondition.versionId,
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
            SelectVersionPlanList(params).then(response => {
                this.selectVersionPlanList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    //添加已选择人员
    @action
	addVersionPlan = (params) => {
        let value = {
            id: params.id,
            projectVersion: {
                id: params.version
            }
        }
        return new Promise((resolve,reject)=>{
            UpdataWorkItem(value).then(response => {
                if(response.code=== 0){
                    this.getSelectVersionPlanList()
                }
                resolve()
            }).catch(error => {
                reject()
                console.log(error)
            })
        })
    }
    //添加已选择人员
    @action
	deleVersionPlan = (params) => {
        let value = {
            id: params.id,
            projectVersion: {
                id: "nullstring"
            }
        }
		UpdataWorkItem(value).then(response => {
            if(response.code=== 0){
                this.getSelectVersionPlanList()
            }
            resolve()
            // this.versionPlanList = response.data.versionPlanList
            // this.searchVersionPlan(this.searchVersionPlanName)
        }).catch(error => {
            console.log(error)
        })
    }
    //搜索已选择人员
    @action
	searchVersionPlan = (params) => {
        this.searchVersionPlanName = params
		SearchVersionPlan(params).then(response => {
            // console.log(response)
            this.selectVersionPlanList = response.data.selectVersionPlanList;
        }).catch(error => {
            console.log(error)
        })
    }
    //搜索已未选择人员
    @action
	searchAllVersionPlan = (params) => {
		SearchAllVersionPlan(params).then(response => {
            // console.log(response)
            this.versionPlanList = response.data.versionPlanList;
        }).catch(error => {
            console.log(error)
        })
    }
}
export const EDITIONPLAN_STORE = "versionPlanStore"