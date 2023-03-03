import { observable, action, extendObservable } from "mobx";
import {GetNoPlanWorkList,GetWorkList,GetSprintList,SetSprint} from "../api/SprintPlanApi";

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
	getNoPlanWorkList = (value) => {
        this.setNoPlanSearchCondition(value)
		GetNoPlanWorkList(this.noPlanSearchCondition).then(response => {
            if(response.code=== 0){
                this.noPlanWorkList = response.data;
                // this.noPlanTotal = 
            }
			
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    setSearchCondition = (value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
    }

    @action
	getWorkList = (value) => {
        this.setSearchCondition(value)
        // const params={
        //     projectId: value.projectId,
        //     sprintId: value.sprintId,
        //     sortParams: [{
        //         name: "title",
        //         orderType:"asc"
        //     }],
        //     pageParam: {
        //         pageSize: 10,
        //         currentPage: this.searchCondition.currentPage
        //     }
        // }
		GetWorkList(this.searchCondition).then(response => {
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