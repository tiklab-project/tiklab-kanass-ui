/*
 * @Descripttion: 迭代store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import { observable, action } from "mobx";
import {
    FindSprintList, AddsprintList, DelesprintList,
    SearchsprintList, EditsprintList, FindDmUserPage, FindAllSprintState,
    CreateSprintFocus, FindSprintFocusList, DeleteProjectFocusByQuery, FindFocusSprintList
} from "../api/SprintApi"


export class SprintStore {
    // 迭代列表
    @observable 
    sprintlist = [];

    // 搜索迭代的名字
    @observable 
    searchSprintName = [];

    // 搜索迭代的id
    @observable 
    searchSprintId = [];

    // 成员列表
    @observable 
    uselist = [];

    // 迭代查询分页参数
    @observable 
    sprintPageParams = {
        orderParams: [{
            name: "sprintName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    // 迭代总数
    @observable 
    totalRecord = "";

    // 迭代状态列表
    @observable 
    sprintStateList = []
    // 筛选状态
    @observable filterType = "pending"

    /**
     * 设置筛选状态
     * @param {*} value 
     */
    @action 
    setFilterType = (value) => {
        this.filterType = value
    }

    /**
     * 获取迭代列表
     */
    @action
    getsprintlist = () => {
        FindSprintList().then(response => {
            this.sprintlist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 根据条件查询迭代列表带分页
     * @param {*} value 
     * @returns 
     */
    @action
    findSprintList = async(value) => {
        Object.assign(this.sprintPageParams, {...value})
        const data = await FindSprintList(this.sprintPageParams)
        if(data.code === 0) {
            this.sprintlist = data.data;
        }
        return data.data;
    }

    /**
     * 查找关注的迭代列表
     * @param {查询参数} value 
     * @returns 
     */
    @action
    findFocusSprintList = async(value) => {
        Object.assign(this.sprintPageParams, { ...value })
        const data = await FindFocusSprintList(this.sprintPageParams)
        if(data.code === 0) {
            this.sprintlist = data.data;
            // this.totalRecord = response.data.totalRecord;
        }
        return data.data;
    }

    /**
     * 添加迭代
     * @param {迭代信息} values 
     * @returns 
     */
    @action
    addsprintlist = async (values) => {
        const data = await AddsprintList(values)
        if (data.code === 0) {
            this.findSprintList(values.project.id, this.searchSprintName)
        }
        return data;
    }

    /**
     * 删除迭代
     * @param {迭代id} values 
     * @returns 
     */
    @action
    delesprintList = async(values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await DelesprintList(param);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 根据id查找迭代
     * @param {迭代id} values 
     * @returns 
     */
    @action
    searchSprint = async(values) => {

        const param =  new FormData()
        param.append("id", values)
        const data = await SearchsprintList(param)
        if(data.code === 0){
            return data;
        }

    }

    /**
     * 编辑迭代
     * @param {*} values 
     * @returns 
     */
    @action
    editSprint = async(values) => {
        const data = await EditsprintList(values)
        if (data.code === 0) {
            this.findSprintList(values.project.id, this.searchSprintName)
        }
        return data;
    }

    /**
     * 设置分页参数
     * @param {} value 
     */
    @action
    setSprintPageParam = (value) => {
        this.sprintPageParams = { ...value }
    }

    /**
     * 获取项目成员
     * @param {项目id} projectId 
     */
    @action
    getUseList = (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        FindDmUserPage(params).then(response => {
            this.uselist = response.data.dataList;
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 查找全部迭代状态
     */
    @action
    findAllSprintState = () => {
        FindAllSprintState().then(response => {
            this.sprintStateList = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 添加迭代关注
     * @param {*} value 
     * @returns 
     */
    @action
    createSprintFocus = async(value) => {
       const data = await CreateSprintFocus(value);
       return data;
    }

    /**
     * 查找迭代列表
     * @param {*} value 
     * @returns 
     */
    @action
    findSprintFocusList = async(value) => {
       const data = await FindSprintFocusList(value);
       return data;
    }

    /**
     * 取消关注
     * @param {*} value 
     * @returns 
     */
    @action
    deleteSprintFocus = async(value) => {
       const data = await DeleteProjectFocusByQuery(value);
       return data;
    }
}

export const SPRINT_STORE = "sprintStore"