/*
 * @Descripttion: 日志store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:56:50
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-24 09:32:54
 */
import { observable, action } from "mobx";
import {FindAllWorkLog,PerWorkingHours,FindMatterWorkingHours, FindWorkLogPage,FindAllProject } from "../api/logApi";

export class LogStore {
    @observable logList = [];
    @observable selectUserCondition = {
        currentPage: 0
    }
    @observable selectWorkCondition = {
        currentPage: 0
    }
    
    @observable selectLogCondition = {
        orderParams: [{
            name: "id",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
            total: 1
        }
    }

    @action
	findAllWorkLog = async() => {
		const data = await FindAllWorkLog();
        this.LogAllList = data;
        return data;
    }

    @action
	findWorkLogPage = async(value) => {
        Object.assign(this.selectLogCondition, {...value} )
		const data = await FindWorkLogPage(this.selectLogCondition);
        
        if(data.code === 0){
            this.logList = data.data.dataList;
            this.selectLogCondition.pageParam.total = data.data.totalRecord
        }
        return data;
    }

    @action
	perWorkingHours = async(value) => {
        this.selectUserCondition = {...this.selectUserCondition,...value}
        
		const data = await PerWorkingHours(this.selectUserCondition);
        return data;
    }

    @action
	findMatterWorkingHours = async(value) => {
        this.selectWorkCondition = {...this.selectWorkCondition,...value};
		const data = await FindMatterWorkingHours(this.selectWorkCondition);
        return data;
    }

    @action
	findAllProject = async() => {
		const data = await FindAllProject();
        return data;
    }

    @action
	findAllProject = async() => {
		const data = await FindAllProject();
        return data;
    }
}

export const LOG_STORE = "logStore"