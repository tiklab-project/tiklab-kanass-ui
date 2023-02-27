/*
 * @Descripttion: 工时store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:56:50
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-24 09:32:54
 */
import { observable, action } from "mobx";
import {FindAllWorkLog,FindProjectUserLog,FindUserProjectLog, FindWorkLogPage, 
    FindAllUser, FindProjectWorkItemLog, FindWorkItemList, AddWorkLog, FindWorkLog, UpdateWorkLog } from "../api/LogApi";

export class LogStore {
    @observable logList = [];
    @observable userList = [];
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
            pageSize: 30,
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
	findAllUser = async() => {
		const data = await FindAllUser();
        this.userList = data.data;
        return data;
    }

    @action
	findWorkLog = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
		const data = await FindWorkLog(params);
        return data;
    }
    

    @action
	findWorkLogPage = async(value) => {
        Object.assign(this.selectLogCondition, {...value} )
		const data = await FindWorkLogPage(this.selectLogCondition);
        // this.LogAllList = data;

        if(data.code === 0){
            this.logList = data.data.dataList;
            this.selectLogCondition.pageParam.total = data.data.totalRecord
        }
        return data;
    }

    @action
    findProjectUserLog = async(value) => {
        this.selectUserCondition = {...this.selectUserCondition,...value}
        
		const data = await FindProjectUserLog(this.selectUserCondition);
        return data;
    }

    @action
    findProjectWorkItemLog = async(value) => {
        this.selectUserCondition = {...this.selectUserCondition,...value}
        
		const data = await FindProjectWorkItemLog(this.selectUserCondition);
        return data;
    }

    @action
	findUserProjectLog = async(value) => {
        this.selectWorkCondition = {...this.selectWorkCondition,...value};
		const data = await FindUserProjectLog(this.selectWorkCondition);
        return data;
    }

    @action
    findWorkItemList = async(value) => {
        
		const data = await FindWorkItemList(value);
        return data;
    }

    @action
    addWorkLog = async(value) => {
        const data = await AddWorkLog(value);
        return data;
    }
    @action
    updateWorkLog = async(value) => {
        const data = await UpdateWorkLog(value);
        return data;
    }
    
    
}

export const LOG_STORE = "logStore"