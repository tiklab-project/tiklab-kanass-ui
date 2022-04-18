/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:21:47
 */
import { observable, action } from "mobx";
import { StatProjectWorkItem,StatWorkItemByBusStatus,ManageSprint,GetWorkType,FindWorkStatusListBySorts } from "../api/home";
export class HomeStore {
    @observable ProjectList = [];

    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("masterId",value)
		const data = await StatProjectWorkItem(params);
        return data;
    }

    @action
	statWorkItemByBusStatus = async(value) => {
        const params = new FormData();
        params.append("masterId",value)
		const data = await StatWorkItemByBusStatus(params);
        return data;
    }

    @action
	manageSprint = async(value) => {
        const params = new FormData();
        params.append("masterId",value)
		const data = await ManageSprint(params);
        return data;
    }

    //获取事项类型
    @action
    workType= async() => {
        const data = await GetWorkType();
        return data;
    }

    @action
    findWorkStatusListBySorts= async(value) => {
        const data = await FindWorkStatusListBySorts(value);
        return data;
    }
}

export const HOME_STORE = "homeStore"