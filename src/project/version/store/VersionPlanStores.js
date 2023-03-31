/*
 * @Descripttion: 版本事项关联关系store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class VersionPlanStore {
    // 版本关联事项列表
    @observable 
    versionPlanList = [];

    // 已被版本关联的事项列表
    @observable selectVersionPlanList = [];
    // 版本搜索条件
    @observable searchCondition = {
        currentPage: 1
    };
    // 搜索被关联的事项列表条件
    @observable searchSelectCondition = {
        currentPage: 1
    };

    @observable workTypeList = [];

    /**
     * 获取未被关联的版本事项
     * @param {*} value 
     * @returns 
     */
    @action
	getVersionPlanList = async(value) => {
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
        const data = await Service("/workItem/findWorkItemList", params)
        if(data.code === 0){
            this.versionPlanList = data.data;
        }
        return data;
    }

    /**
     * 获取已被版本关联的事项列表
     * @param {版本id} value 
     * @returns 
     */
    @action
	getSelectVersionPlanList = async(value) => {
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
        const data = await Service("/workItem/findWorkItemList", params)
        if(data.code === 0){
            this.selectVersionPlanList = data.data;
        }
        return data;
		
    }
    
    /**
     * 添加版本的关联事项
     * @param {*} params 
     * @returns 
     */
    @action
	addVersionPlan = async(params) => {
        let value = {
            id: params.id,
            projectVersion: {
                id: params.version
            }
        }

        const data = await Service("/workItem/updateWorkItem", value)
        if(data.code === 0){
            this.getSelectVersionPlanList()
        }
        return data;
    }

    /**
     * 删除事项与版本的关联关系
     * @param {*} params 
     * @returns 
     */
    @action
	deleVersionPlan = async(params) => {
        let value = {
            id: params.id,
            projectVersion: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", value)
        if(data.code === 0){
            this.getSelectVersionPlanList()
        }
        return data;
    }

    @action
    getWorkTypeList = async(value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList",value);
        if(data.code === 0){
            this.workTypeList = data.data;
        }
        return data.data;
    }

}
export const EDITIONPLAN_STORE = "versionPlanStore"