/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:20:36
 */
import { observable, action } from "mobx";
import { FindSprintPage, FindDmUserPage, CreateSprint, FindSprint, UpdateSprint } from "../api/sprint";

export class SprintStore {
    @observable workList = [];
    @observable total = [];
    @observable activeIndex = "survey";


    @observable searchCondition = {
        parentIdIsNull: true,
        orderParams: [{
            name: "sprintName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };

    @action
    setActiveIndex = async (value) => {
        this.activeIndex = value;
    }

    @action
    getSprintConditionPage = async (value) => {
        this.setSearchCondition(value);
        let data = await FindSprintPage(this.searchCondition);
        return data;
    }

    @action
    setSearchCondition = (value) => {
        Object.assign(this.searchCondition, { ...value })
    }

    @action
    getUseList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await FindDmUserPage(params);
        return data;
    }

    @action
    createSprint = async(value) => {
        const data = await CreateSprint(value);
        return data;
    }

    @action
    createSprint = async(value) => {
        const data = await CreateSprint(value);
        return data;
    }

    @action
    findSprint = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await FindSprint(params);
        return data;
    }

    @action
    findSprint = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await FindSprint(params);
        return data;
    }

    @action
    updateSprint = async(values) => {
        const data = await UpdateSprint(values)
        return data;
    }

}
export const SPRINT_STORE = "sprintStore"