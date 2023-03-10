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

export class ProjectSetProjectStore {
    @observable uselist = [];
    @observable projectSetList = [];
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
     * 获取项目集关联项目
     * @param {项目集id} values 
     * @returns 
     */
    @action
    findProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams);
        
        this.projectRelevance = data.data
        return data;
    }

    /**
     * 获取已被关联项目和未被关联项目
     * @returns 
     */
    @action
    findProjectIsOrNotRe = async () => {
        const data = await Service("/projectSet/findProjectIsOrNotRe");
        if (data.code === 0) {
            this.noRelatedProjects = data.data.noRelatedProjects;
            this.relatedProjects = data.data.relatedProjects;
        }
        return data;
    }

    /**
     * 更新项目的项目集字段，用来取消项目集的项目关联
     * @param {*} value 
     * @returns 
     */
    @action
    updateProject = async (value) => {
        const data = await Service("/project/updateProject", value);
        return data;
    }

    /**
     * 添加项目集的关联项目
     * @param {*} value 
     * @returns 
     */
    addRelevance = async (value) => {
        const data = await Service("/projectSet/addRelevance", value);

        return data;
    }
}
export const PROJECTSETPROJECT_STORE = "ProjectSetProjectStore"