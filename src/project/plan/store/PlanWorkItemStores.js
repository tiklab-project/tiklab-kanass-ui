import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class PlanWorkItemStore {
    @observable planWorkItemList = [];
    @observable selectPlanWorkItemList = [];
    @observable searchPlanWorkItemName = [];
    @observable workTypeList=[]
    @observable searchCondition = {
        currentPage: 1,
        total: 0
    };
    @observable searchSelectCondition = {
        currentPage: 1
    };

    // 获取已选择规划事项
    @action
	getWorkItemList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            title: this.searchCondition.title,
            workTypeId: this.searchCondition.workTypeId,
            planId: this.searchCondition.planId,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }

        const data = await Service("/workItem/findWorkItemPage", params)
        if(data.code === 0){
            this.planWorkItemList = data.data.dataList;
        }
        return data;
    }


    //获取未选择规划事项
    @action
	findUnPlanWorkItemPage = async(value) => {
        Object.assign(this.searchSelectCondition, {...value})
        const params={
            projectId: this.searchSelectCondition.projectId,
            planId: this.searchSelectCondition.planId,
            title: this.searchSelectCondition.title,
            parentIdIsNull: true,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchSelectCondition.currentPage
            }
        }
        const data = await Service("/workItem/findUnPlanWorkItemPage", params);
        if(data.code === 0){
            this.selectPlanWorkItemList = data.data.dataList;
            this.searchSelectCondition.total = data.data.totalRecord;
        }
        return data;
    }
    //添加已选择事项
    @action
	createPlanWorkItem = async(params) => {
        const data = await Service("/planWorkItem/createPlanWorkItem", params);
        
        return data;
		
    }
    //添加已选择事项
    @action
	delePlanWorkItem = async(params) => {
        const data = await Service("/planWorkItem/deletePlanWorkItemCondition", params);
        return data;
    }
    

    //获取事项类型
    @action
    getWorkTypeList= async() => {
        const data = await Service("/workTypeDm/findWorkTypeDmList", params);
        if(data.code === 0){
            this.workTypeList = data.data;
        }
    }
}
export const PLANWORKITEM_STORE = "planWorkItemStore"