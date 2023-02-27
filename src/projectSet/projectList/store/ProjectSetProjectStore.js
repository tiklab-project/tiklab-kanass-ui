/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-06 17:31:15
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 11:19:17
 */
import {
    GetUseList, FindProjectList, FindProjectIsOrNotRe, UpdateProject, AddRelevance
} from "../api/ProjectSetProject";
import { observable, action } from "mobx";

export class ProjectSetProjectStore {
    @observable uselist = [];
    @observable projectSetList = [];
    @observable projectRelevance = [];
    @observable noRelatedProjects = [];
    @observable projectSetAllList = [];
    @observable relatedProjects = [];
    @observable projectSetPageParams = {
        current: 1,
        pageSize: 10,
        total: 1
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

    @observable type = "add";
    @observable visible = false;

    @action
    setType = (value) => {
        this.type = value
    }

    @action
    setVisible = (value) => {
        this.visible = value
    }
    // 获取成员列表
    @action
    getUseList = () => {
        GetUseList().then(response => {
            this.uselist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }
    //获取关联项目
    @action
    findProjectList = async (values) => {
        console.log(data)
        Object.assign(this.projectPageParams, { ...values })
        const data = await FindProjectList(this.projectPageParams);
        
        this.projectRelevance = data.data
        return data;
    }

    @action
    findProjectIsOrNotRe = async () => {
        const data = await FindProjectIsOrNotRe();
        if (data.code === 0) {
            this.noRelatedProjects = data.data.noRelatedProjects;
            console.log(this.noRelatedProjects)
            this.relatedProjects = data.data.relatedProjects;
        }
        return data;
    }

    // 取消关联项目
    @action
    updateProject = async (value) => {
        const data = await UpdateProject(value);

        return data;
    }

    // 添加关联
    addRelevance = async (value) => {

        const data = await AddRelevance(value);

        return data;
    }
}
export const PROJECTSETPROJECT_STORE = "ProjectSetProjectStore"