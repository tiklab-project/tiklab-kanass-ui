/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-18 17:32:10
 */
import { observable, action } from "mobx";
import { FindProjectSetPage,FindAllUser,FindAllProjectSetType,AddproList } from "../api/projectSetApi";
export class ProjectSetStore {
    @observable ProjectSetList = [];
    @observable searchProjectSetCondition = {
        orderParams: [{
            name: "name",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @action
	findProjectSetPage = async(value) => {
        Object.assign(this.searchProjectSetCondition,value)
		const data = await FindProjectSetPage(this.searchProjectSetCondition);
        return data;
    }

    @action
	findAllUser = async() => {
		const data = await FindAllUser();
        return data;
    }

    @action
    addProjectSet = async(values) => {

        const data = await AddproList(values);
        return data;
    }

    @action
    findAllProjectSetType = async() => {
        const data = await FindAllProjectSetType();
        return data;
    }
}

export const PROJECTSET_STORE = "projectSetStore"