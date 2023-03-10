/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-06 17:31:15
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 11:19:17
 */
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";

export class ProjectSetStore {
    @observable uselist = [];
    @observable projectSetList = [];
    @observable allProjectSetList = [];
    @observable projectRelevance = [];
    @observable noRelatedProjects = [];
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

    /**
     * 获取全部系统成员
     * @returns 
     */
    @action
    getUseList = async() => {
        const data = await Service("/user/user/findAllUser")
        if(data === 0){
            this.uselist = data.data;
        }
        return data
    }

    /**
     * 添加项目集
     * @param {*} values 
     * @returns 
     */
    @action
    addProjectSetSet = async (values) => {
        const data = await Service("/projectSet/createProjectSet", values);
        return data;
    }

    /**
     * 获取项目集列表
     * @param {*} value 
     * @returns 
     */
    @action
    getProjectSetlist = async(value) => {
        const data = await Service("/projectSet/findProjectSetList", value);
        if(data.code === 0){
            this.projectSetList = data.data;
        }
        return data;
    }

    /**
     * 删除项目集
     * @param {项目集id} values 
     * @returns 
     */
    @action
    deleProjectSet = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/projectSet/deleteProjectSet", param);
        if(data.code === 0){
            that.getProjectSetlist()
        }
        return data;
    }

    // 
    /**
     * 按照id查找项目集
     * @param {项目集id} values 
     * @returns 
     */
    @action
    findProjectSet = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/projectSet/findProjectSet", param);
        return data;
    }

    /**
     * 更新项目集
     * @param {*} values 
     * @returns 
     */
    @action
    updateProjectSet = async(values) => {
        const data = await Service("/projectSet/updateProjectSet", values);
        return data;
    }

    /**
     * 获取项目集关联项目
     * @param {*} values 
     * @returns 
     */
    @action
    findProjectList = async(values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams);
        this.projectRelevance = data.data
        return data;
    }

    /**
     * 获取项目集已关联和未关联的项目列表
     * @returns 
     */
    @action
    findProjectIsOrNotRe = async() => {
        const data = await Service("/projectSet/findProjectIsOrNotRe");
        if (data.code === 0) {
            this.noRelatedProjects = data.data.noRelatedProjects;
            console.log(this.noRelatedProjects)
            this.relatedProjects = data.data.relatedProjects;
        }
        return data;
    }

    /**
     * 更新项目集与项目的关联
     * @param {*} value 
     * @returns 
     */
    @action
    updateProject = async(value) => {
        const data = await Service("/project/updateProject", value);
        return data;
    }

    /**
     * 添加项目集的关联项目
     * @param {*} value 
     * @returns 
     */
    addRelevance = async(value) => {
        const data = await Service("/projectSet/addRelevance ", value);

        return data;
    }

    /**
     * 查找所有项目集
     * @returns 
     */
    findAllProjectSet = async() => {
        const data = await Service("/projectSet/findAllProjectSet");
        if(data.code === 0){
            this.projectSetList = data.data;
        }
        
        return data;
    }

    /**
     * 添加项目集收藏
     * @param {*} value 
     * @returns 
     */
    @action
    createProjectSetFocus = async(value) => {
        const data = await Service("/projectSetFocus/createProjectSetFocus", value);
        return data;
    }

    /**
     * 
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectSetFocusList = async(value) => {

        const data = await Service("/projectSetFocus/findProjectSetFocusList", value);
        return data;
    }

    @action
    deleteProjectSetFocusByQuery = async(value) => {
        const data = await Service("/projectSetFocus/deleteProjectSetFocusByQuery", value);
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
        const data = await Service("/projectSet/findRecentProjectSetList", params);
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
        const data = await Service("/projectSet/findFocusProjectSetList", params);
        if(data.code === 0){
            this.projectSetList = data.data;
        }
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value);
        return data;

    }

}
export const PROJECTSET_STORE = "projectSetStore"