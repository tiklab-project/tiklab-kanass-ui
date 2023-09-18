/*
 * @Descripttion: 规划迭代的事项store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-22 16:14:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 17:09:18
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
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
	getNoPlanWorkList = async(value) => {
        const params={
            projectId: value.projectId,
            sprintIdIsNull: value.sprintIdIsNull,
            orderParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/workItem/findWorkItemList", params)
		if(data.code=== 0){
            this.noPlanWorkList = data.data;
        }
        return data;
    }

    /**
     * 获取为规划迭代事项列表
     * @param {*} value 
     */
    @action
	getWorkList = async(value) => {
        const params={
            projectId: value.projectId,
            sprintIdIsNull: value.sprintIdIsNull,
            orderParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/workItem/findWorkItemList", params)
        if(data.code=== 0){
            this.planWorkList = data.data;
        }
		return data;
    }

    /**
     * 获取迭代列表 
     * @param {*} value 
     */
    @action
	getSprintList = async(value) => {
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
        const data = await Service("/sprint/findSprintList", params)
        if(data.code=== 0){
            this.planWorkList = data.data;
        }
		return data;
    }

    /**
     * 给事项分配迭代
     * @param {*} value 
     * @returns 
     */
    @action
	setSprint = async(value) => {
        const params={
            id: value.startId,
            updateField: "sprint",
            sprint: {
                id: value.endId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    /**
     * 删除分配迭代
     * @param {*} value 
     * @returns 
     */
    @action
	delSprint = async(value) => {
        const params={
            id: value.startId,
            updateField: "sprint",
            sprint: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }
}

export default new ProjectSprintPlanStore();