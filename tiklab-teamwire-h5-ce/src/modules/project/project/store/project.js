/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-18 17:32:10
 */
import { observable, action } from "mobx";
import { FindProjectPage,FindAllUser,FindAllProjectType,AddproList } from "../api/projectApi";
export class ProjectStore {
    @observable ProjectList = [];
    @observable activeIndex = "survey";

    @observable searchProjectCondition = {
        orderParams: [{
            name: "projectName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @action
    setActiveIndex = (value) => {
        this.activeIndex = value
    }
    @action
	findProjectPage = async(value) => {
        Object.assign(this.searchProjectCondition,value)
		const data = await FindProjectPage(this.searchProjectCondition);
        return data;
    }

    @action
	findAllUser = async() => {
		const data = await FindAllUser();
        return data;
    }

    @action
    addProject = async(values) => {

        const data = await AddproList(values);
        return data;
    }

    @action
    findAllProjectType = async() => {
        const data = await FindAllProjectType();
        return data;
    }
}

export const PROJECT_STORE = "projectStore"