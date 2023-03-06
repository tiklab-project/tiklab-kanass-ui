import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"

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

    /**
     * 获取计划列表
     * @param {*} value 
     * @returns 
     */
    @action
	getPlanList = async(value) => {
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
        const data = await Service("/plan/findPlanPageTree", params)
        if(data.code=== 0){
            this.planList = data.data.dataList;
        }
        return data;
    }
    
    /**
     * 添加计划
     * @param {*} value 
     * @returns 
     */
    @action
	addPlan = async(value) => {
        const data = await Service("/plan/createPlan", value)
        if(data.code=== 0){
            this.getPlanList()
        }
        return data;
		
    }

    /**
     * 根据计划id删除计划
     * @param {计划id} params 
     * @returns 
     */
    @action
	delePlan = async(params) => {
        const param = new FormData()
        param.append("id", params.id)
        const data = await Service("/plan/deletePlan", value)
        if(data.code=== 0 ){
            this.getPlanList()
        }
        return data;
    }

    /**
     * 根据id获取计划
     * @param {计划id} params 
     * @returns 
     */
    @action
	searchPlanById = async(params) => {
        const param = new FormData()
        param.append("id", params.id)
        const data = await Service("/plan/findPlan", param);
        if(data.code === 0){
            this.planItem = data.data;
        }
        return data;
    }


    /**
     * 编辑计划
     * @param {*} value 
     * @returns 
     */
    @action
	editPlan = async(value) => {
        let params = {
            id: value.id,
            planName: value.planName,
            endTime: value.endTime,
            startTime: value.startTime,
            master: value.master,
            project:  value.project,
            planState: value.planState
        }
        const data = await Service("/plan/updatePlan", params);
        if(data.code=== 0 ){
            this.getPlanList()
        }
		
    }

    /**
     * 获取项目成员
     * @param {*} projectId 
     */
    @action
    getUseList = async(projectId) => {
        const params={
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params);
		if(data.code === 0){
            this.uselist = data.data.dataList;
        }
        return data;
    }
}
export const PLAN_STORE = "planStore"