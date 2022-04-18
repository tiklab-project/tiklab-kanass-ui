/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-06 17:31:15
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 11:19:17
 */
import {
    GetUseList, GreateProjectSet, FindProjectSetPage, DeleteProjectSet, FindProjectSet,
    UpdateProjectSet, FindProjectList, FindProjectIsOrNotRe, UpdateProject, AddRelevance,
    FindAllProjectSet
} from "../api/program";
import { observable, action } from "mobx";

export class ProgramStore {
    @observable uselist = [];
    @observable programList = [];
    @observable projectRelevance = [];
    @observable noRelatedProjects = [];
    @observable programAllList = [];
    @observable relatedProjects = [];
    @observable programPageParams = {
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
    addProgramSet = async (values) => {
        const data = await GreateProjectSet(values);
        return data;
    }

    // 获取项目集列表
    @action
    getProgramlist = (value) => {
        Object.assign(this.programPageParams, { ...value })
        const params = {
            name: this.programPageParams.name,
            master: this.programPageParams.master,
            orderParams: [{
                name: "name",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.programPageParams.current
            }
        }
        FindProjectSetPage(params).then(response => {
            this.programList = response.data.dataList;
            this.programPageParams.total = response.data.totalRecord;
        }).catch(error => {
            console.log(error)
        })
    }

    // 删除项目集
    @action
    deleProgram = (values) => {
        const param = new FormData()
        param.append("id", values)
        const that = this;
        DeleteProjectSet(param).then(response => {
            if (response.code === 0) {
                that.getProgramlist()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    // 按照id查找项目
    @action
    findProgram = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await FindProjectSet(param);
        return data;
    }

    //更新项目集
    @action
    updateProgram = async (values) => {
        const data = await UpdateProjectSet(values);
        return data;
    }

    //获取关联项目
    @action
    findProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await FindProjectList(this.projectPageParams);
        this.projectRelevance = data.data.dataList
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

    //查找所有项目集
    findAllProjectSet = async (value) => {
        const data = await FindAllProjectSet(value);
        this.programAllList = data.data;
        return data;
    }
}
export const PROGRAM_STORE = "programStore"