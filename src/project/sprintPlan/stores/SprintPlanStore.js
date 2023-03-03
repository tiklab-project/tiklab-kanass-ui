/*
 * @Descripttion: 规划迭代的事项store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-22 16:14:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 17:09:18
 */
import { observable, action } from "mobx";
import {GetNoPlanWorkList,GetWorkList,GetSprintList,SetSprint} from "../api/SprintPlan";

export class ProjectSprintPlanStore {
    // 没被规划迭代列表
    @observable 
    noPlanWorkList = [];

    // 规划事项列表 
    @observable 
    planWorkList = [];

    //迭代列表
    @observable 
    sprintList = [];

    // 查询的分页参数
    @observable 
    searchCondition = {
        currentPage: 1
    };

    /**
     * 获取没被规划迭代列表
     * @param {*} value 
     */
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

    /**
     * 获取为规划迭代事项列表
     * @param {*} value 
     */
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

    /**
     * 获取迭代列表 
     * @param {*} value 
     */
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

    /**
     * 给事项分配迭代
     * @param {*} value 
     * @returns 
     */
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
                resolve(response.code)
            }).catch(error => {
                console.log(error)
            })
        })
		
    }

    /**
     * 删除分配迭代
     * @param {*} value 
     * @returns 
     */
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
                resolve(response.code)
            }).catch(error => {
                console.log(error)
            })
        })
		
    }
}

export const PLANSPRINT_STORE = "projectSprintPlanStore"