/*
 * @Descripttion: 工时store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:56:50
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-24 09:32:54
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class LogStore {
    // 工时列表
    @observable 
    logList = [];
    // 成员列表
    @observable 
    userList = [];

    // 查找成员日志的分页参数
    @observable selectUserCondition = {
        currentPage: 0
    }
    // 查找事项日志的分页参数
    @observable selectWorkCondition = {
        currentPage: 0
    }
    // 统计日志的分页参数
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

    /**
     * 查找所有的日志
     * @returns 
     */
    @action
	findAllWorkLog = async() => {
        const data = await Service("/workLog/findAllWorkLog", params);
        this.LogAllList = data;
        return data;
    }

    /**
     * 查找所有的人员
     * @returns 
     */
    @action
	findAllUser = async() => {
        const data = await Service("/user/user/findAllUser");
        this.userList = data.data;
        return data;
    }

    /**
     * 根据id 查找日志
     * @param {日志id} value 
     * @returns 
     */
    @action
	findWorkLog = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workLog/findWorkLog");
        return data;
    }
    
    /**
     * 按照分页查找事项的日志
     * @param {*} value 
     * @returns 
     */
    @action
	findWorkLogPage = async(value) => {
        Object.assign(this.selectLogCondition, {...value} )
        const data = await Service("/workLog/findWorkLogPage", params);
        if(data.code === 0){
            this.logList = data.data.dataList;
            this.selectLogCondition.pageParam.total = data.data.totalRecord
        }
        return data;
    }

    /**
     * 查询项目每个成员的工时
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectUserLog = async(value) => {
        this.selectUserCondition = {...this.selectUserCondition,...value}
        const data = await Service("/workLog/findProjectUserLog", this.selectUserCondition);
        return data;
    }

    /**
     * 查找项目下每个事项的工时
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectWorkItemLog = async(value) => {
        this.selectUserCondition = {...this.selectUserCondition,...value}
        const data = await Service("/workLog/findProjectWorkItemLog", this.selectUserCondition);
        return data;
    }

    /**
     * 查询成员负责的每个项目的工时
     * @param {*} value 
     * @returns 
     */
    @action
	findUserProjectLog = async(value) => {
        this.selectWorkCondition = {...this.selectWorkCondition,...value};
        const data = await Service("/workLog/findUserProjectLog", this.selectWorkCondition);
        return data;
    }

    /**
     * 查找事项列表
     * @param {*} value 
     * @returns 
     */
    @action
    findWorkItemList = async(value) => {
        const data = await Service("/workItem/findWorkItemList", value);
        return data;
    }

    /**
     * 添加日志
     * @param {*} value 
     * @returns 
     */
    @action
    addWorkLog = async(value) => {
        const data = await Service("/workLog/createWorkLog", value);
        return data;
    }

    /**
     * 更新日志
     * @param {*} value 
     * @returns 
     */
    @action
    updateWorkLog = async(value) => {
        const data = await Service("/workLog/updateWorkLog", value);
        return data;
    }
    
    
}

export const LOG_STORE = "logStore"