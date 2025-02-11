/*
 * @Descripttion: 版本计划事项接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:14:32
 */
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class VersionPlanStore {
    @observable noPlanVersionWorkList = [];
    @observable planVersionWorkList = [];
    @observable versionList = [];
    @observable searchCondition = {
        orderParams: [{
            name: "code",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };

    @observable noPlanSearchCondition = {
        orderParams: [{
            name: "code",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };
    @observable noPlanCurrent = 0;
    @observable planCurrent = 0;
    @observable noPlanTotal = 0;
    @observable planTotal = 0;

    @action
    setNoPlanSearchCondition = (value) => {
        this.noPlanSearchCondition = extendObservable(this.noPlanSearchCondition,  { ...value })
    }

    @action
    setNoPlanVersionWorkList = (value) => {
        this.noPlanVersionWorkList = value;
    }

    @action
	getNoPlanVersionWorkList = async(value) => {
        this.setNoPlanSearchCondition(value)
        const data = await Service("/workItem/findConditionWorkItemPage", this.noPlanSearchCondition)
		if(data.code=== 0){
            if(data.data.currentPage === 1){
                this.noPlanVersionWorkList = data.data.dataList;
            }else {
                this.noPlanVersionWorkList.push(...data.data.dataList);
            }
            
            this.noPlanTotal = data.data.totalPage;
        }
        return data;
    }
    @action
    setSearchCondition = (value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
    }

    @action
    setPlanVersionWorkList = (value) => {
        this.planVersionWorkList = value;
    }

    @action
	getWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findConditionWorkItemPage", this.searchCondition)
        if(data.code === 0){
            if(data.data.currentPage === 1){
                this.planVersionWorkList = data.data.dataList;
            }else {
                this.planVersionWorkList.push(...data.data.dataList);
            }
            this.planTotal = data.data.totalPage;
        }
		return data;
    }

    @action
	getVersionList = async(value) => {
        const params={
            projectId: value.projectId,
            orderParams: [{
                name: "name",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/projectVersion/findVersionList", params)
        if(data.code=== 0){
            this.versionList = data.data;
        }
        return data;
    }

    @action
	updateWorkItem = async(value) => {
        const params={
            id: value.startId,
            updateField: value.updateField,
            projectVersion: {
                id: value.endId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
	delVersion = async(value) => {
        const params={
            id: value.startId,
            updateField: value.updateField,
            projectVersion: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
		
    }

    @action
    haveChildren = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/haveChildren", params)
        return data;
    }

    @action
    findWorkItemAndChildrenIds = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItemAndChildrenIds", params)
        return data;
    }
}

export default new VersionPlanStore();