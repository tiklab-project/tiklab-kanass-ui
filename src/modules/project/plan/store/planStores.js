import { observable, action } from "mobx";
import {PlanList,EditPlan,AddPlan,DelePlan,SearchPlanById,FindDmUserPage} from "../api/plan";

export class PlanStore {
    @observable planList = [];
    @observable planItem = [];
    @observable searchPlanName = [];
    @observable searchCondition = {
        currentPage: 1
    };
    @observable planId = "";
    @observable uselist = "";
    // 获取规划的id
    @action 
    getPlanId = (value) => {
        this.planId = value
    }
    // 获取所有成员
    @action
	getPlanList = (value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            projectId: this.searchCondition.projectId,
            planName: this.searchCondition.planName,
            sortParams: [{
                name: "planName",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            },
            parentIdIsNull: true,
        }
		PlanList(params).then(response => {
            if(response.code=== 0){
                this.planList = response.data.dataList;
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    //添加已选择人员
    @action
	addPlan = (value) => {
        return new Promise((resolve,reject)=>{
            AddPlan(value).then(response => {
                if(response.code=== 0){
                    this.getPlanList()
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
	delePlan = async(params) => {
        const param = new FormData()
        param.append("id", params.id)
		const data= await DelePlan(param)
        if(data.code=== 0 ){
            this.getPlanList()
        }
        return data;
    }
    //搜索已选择人员
    @action
	searchPlanById = (params) => {
        const param = new FormData()
        param.append("id", params.id)
        return new Promise((resolve,reject)=> {
            SearchPlanById(param).then(response => {
                this.planItem = response.data;
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
		
    }
    //编辑版本

    @action
	editPlan = (value) => {
        let params = {
            id: value.id,
            planName: value.planName,
            endTime: value.endTime,
            startTime: value.startTime,
            master: value.master,
            project:  value.project,
            planState: value.planState
        }
        return new Promise((resolve,reject)=> {
            EditPlan(params).then(response => {
                if(response.code=== 0 ){
                    this.getPlanList()
                }
                resolve()
            }).catch(error => {
                console.log(error)
            })
        })
		
    }

    @action
    getUseList = (projectId) => {
        const params={
            domainId: projectId,
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
}
export const PLAN_STORE = "planStore"