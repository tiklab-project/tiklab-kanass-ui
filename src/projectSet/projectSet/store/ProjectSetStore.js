/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-06 17:31:15
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 11:19:17
 */
import {
    GetUseList, GreateProjectSet, FindProjectSetList, DeleteProjectSet, FindProjectSet,
    UpdateProjectSet, FindProjectList, FindProjectIsOrNotRe, UpdateProject, AddRelevance,CreateProjectSetFocus,
    FindProjectSetFocusList, DeleteProjectSetFocusByQuery, FindAllProjectSet, FindRecentProjectSetList, 
    FindFocusProjectSetList, CreateRecent
} from "../api/ProjectSet";
import { observable, action } from "mobx";

export class ProjectSetStore {
    @observable uselist = [];
    @observable projectSetList = [];
    @observable allProjectSetList = [];
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

    // 添加项目集
    @action
    addProjectSetSet = async (values) => {
        const data = await GreateProjectSet(values);
        return data;
    }

    // 获取项目集列表
    @action
    getProjectSetlist = (value) => {
        FindProjectSetList(value).then(response => {
            this.projectSetList = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    // 删除项目集
    @action
    deleProjectSet = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const that = this;
        const data = await DeleteProjectSet(param);
        if(data.code === 0){
            that.getProjectSetlist()
        }
        return data;
    }

    // 按照id查找项目
    @action
    findProjectSet = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await FindProjectSet(param);
        return data;
    }

    //更新项目集
    @action
    updateProjectSet = async(values) => {
        const data = await UpdateProjectSet(values);
        return data;
    }

    //获取关联项目
    @action
    findProjectList = async(values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await FindProjectList(this.projectPageParams);
        this.projectRelevance = data.data
        return data;
    }

    @action
    findProjectIsOrNotRe = async() => {
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
    updateProject = async(value) => {
        const data = await UpdateProject(value);

        return data;
    }

    // 添加关联
    addRelevance = async(value) => {

        const data = await AddRelevance(value);

        return data;
    }

    //查找所有项目集
    findAllProjectSet = async() => {
        const data = await FindAllProjectSet();
        console.log(data)
        if(data.code === 0){
            this.projectSetAllList = data.data;
        }
        
        return data;
    }


    @action
    createProjectSetFocus = async(value) => {

        const data = await CreateProjectSetFocus(value)
        return data;
    }


    @action
    findProjectSetFocusList = async(value) => {

        const data = await FindProjectSetFocusList(value)
        return data;
    }

    @action
    deleteProjectSetFocusByQuery = async(value) => {

        const data = await DeleteProjectSetFocusByQuery(value)
        return data;
    }

    @action
    findRecentProjectSetList = async(value) => {
        const params = {
            orderParams: [{
                name: "recentTime",
                orderType: "asc"
            }]
        }
        const data = await FindRecentProjectSetList(params)
        if(data.code === 0){
            this.projectSetList = data.data;
        }
        return data;
    }

    @action
    findFocusProjectSetList = async(value) => {
        const params = {
            orderParams: [{
                name: "recentTime",
                orderType: "asc"
            }]
        }
        const data = await FindFocusProjectSetList(value)
        if(data.code === 0){
            this.projectSetList = data.data;
        }
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await CreateRecent(value)
        return data;

    }

}
export const PROJECTSET_STORE = "projectSetStore"