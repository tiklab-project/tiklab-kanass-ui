import { observable, action } from "mobx";
import {GetNoPlanWorkList,GetWorkList,GetSprintList,SetSprint} from "../api/sprintPlan";

export class SprintPlanStore {
    @observable noPlanWorkList = [];
    @observable planWorkList = [];
    @observable sprintList = [];
    @observable searchCondition = {
        currentPage: 1
    };
    @action
	getNoPlanWorkList = (value) => {
        const params={
            projectId: value.projectId,
            sprintIdIsNull: value.sprintIdIsNull,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
		GetNoPlanWorkList(params).then(response => {
            if(response.code=== 0){
                this.noPlanWorkList = response.data;
            }
			
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	getWorkList = (value) => {
        const params={
            projectId: value.projectId,
            sprintIdIsNull: value.sprintIdIsNull,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
		GetWorkList(params).then(response => {
            if(response.code=== 0){
                this.planWorkList = response.data;
            }
			
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	getSprintList = (value) => {
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
		GetSprintList(params).then(response => {
            if(response.code=== 0){
                this.sprintList = response.data;
            }
			
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	setSprint = (value) => {
        const params={
            id: value.startId,
            sprint: {
                id: value.endId
            }
        }
        return new Promise((resolve,reject)=> {
            SetSprint(params).then(response => {
                if(response.code=== 0){
                    // this.getNoPlanWorkList()
                    // this.getWorkList()
                    resolve(response.code)
                }
                
            }).catch(error => {
                console.log(error)
            })
        })
		
    }

    @action
	delSprint = (value) => {
        const params={
            id: value.startId,
            sprint: {
                id: "nullstring"
            }
        }
        return new Promise((resolve,reject)=> {
            SetSprint(params).then(response => {
                if(response.code=== 0){
                    // this.getNoPlanWorkList()
                    // this.getWorkList()
                    resolve(response.code)
                }
                
            }).catch(error => {
                console.log(error)
            })
        })
		
    }
}

export const SPRINTPLAN_STORE = "sprintPlanStore"