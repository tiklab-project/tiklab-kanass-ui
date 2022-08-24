/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-18 17:32:10
 */
import { observable, action } from "mobx";
import { FindProjectSetPage,FindAllUser,FindAllProjectSetType,CreateProjectSet, 
    FindProjectSet, UpdateProjectSet, FindProjectList, FindProjectIsOrNotRe, AddRelevance} from "../api/projectSetApi";
export class ProjectSetStore {
    @observable ProjectSetList = [];
    @observable activeIndex = "survey";
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

    @observable projectPageParams = {
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
    createProjectSet = async(values) => {
        const data = await CreateProjectSet(values);
        return data;
    }

    @action
    findAllProjectSetType = async() => {
        const data = await FindAllProjectSetType();
        return data;
    }

    @action
    findProjectSet = async(value) => {
        const params = new FormData();
        params.append("id", value)
        const data = await FindProjectSet(params);
        return data;
    }

    @action
    updateProjectSet = async(value) => {
        const data = await UpdateProjectSet(value);
        return data;
    }

    @action
    findProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await FindProjectList(this.projectPageParams);
        return data;
    }

    @action
    findProjectIsOrNotRe = async () => {
        const data = await FindProjectIsOrNotRe();
        return data;
    }

    @action
    addRelevance = async(value) => {
        const data = await AddRelevance(value);
        return data;
    }
}

export const PROJECTSET_STORE = "projectSetStore"