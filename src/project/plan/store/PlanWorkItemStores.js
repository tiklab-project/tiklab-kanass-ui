import { observable, action } from "mobx";
import {GetWorkItem,FindUnPlanWorkItemPage,CreatePlanWorkItem,DeletePlanWorkItem,WorkType} from "../api/PlanWorkItem";
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
	getWorkItemList = (value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            // projectId: this.searchCondition.projectId,
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
        return new Promise((resolve,reject)=>{
            GetWorkItem(params).then(response => {
                this.planWorkItemList = response.data.dataList;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }


    //获取未选择规划事项
    @action
	findUnPlanWorkItemPage = (value) => {
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
        return new Promise((resolve,reject)=>{
            FindUnPlanWorkItemPage(params).then(response => {
                this.selectPlanWorkItemList = response.data.dataList;
                this.searchSelectCondition.total = response.data.totalRecord;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    //添加已选择事项
    @action
	createPlanWorkItem = async(params) => {
        const data = await CreatePlanWorkItem(params);
        return data;
		
    }
    //添加已选择事项
    @action
	delePlanWorkItem = async(params) => {
        const data = await DeletePlanWorkItem(params);
        return data;
    }
    

    //获取事项类型
    @action
    getWorkTypeList= async() => {
        const data = await WorkType();
        if(data.code === 0){
            this.workTypeList = data.data;
        }
    }
}
export const PLANWORKITEM_STORE = "planWorkItemStore"