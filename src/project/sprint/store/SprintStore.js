/*
 * @Descripttion: 迭代store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"

export class SprintStore {
    // 迭代列表
    @observable
    sprintList = [];

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
    getsprintlist = async() => {
        const data = await Service("/sprint/findAllSprint", params)
        if (data.code === 0) {
            this.sprintList = data.data;
        }
        return data;
    }

    /**
     * 根据条件查询迭代列表带分页
     * @param {*} value 
     * @returns 
     */
    @action
    findSprintList = async (value) => {
        Object.assign(this.sprintPageParams, { ...value })
        const data = await Service("/sprint/findSprintList", this.sprintPageParams)
        if (data.code === 0) {
            this.sprintList = data.data;
        }
        return data.data;
    }

    /**
     * 查找关注的迭代列表
     * @param {查询参数} value 
     * @returns 
     */
    @action
    findFocusSprintList = async (value) => {
        // Object.assign(this.sprintPageParams, { ...value })
        const data = await Service("/sprint/findFocusSprintList", value)
        if (data.code === 0) {
            this.sprintList = data.data;
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
        const data = await Service("/sprint/createSprint", values)
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
    delesprintList = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await Service("/sprint/deleteSprint", param)
        if (data.code === 0) {
            return data;
        }
    }

    /**
     * 根据id查找迭代
     * @param {迭代id} values 
     * @returns 
     */
    @action
    searchSprint = async (values) => {

        const param = new FormData()
        param.append("id", values)
        const data = await Service("/sprint/findSprint", param)
        if (data.code === 0) {
            return data;
        }

    }

    /**
     * 编辑迭代
     * @param {*} values 
     * @returns 
     */
    @action
    editSprint = async (values) => {
        const data = await Service("/sprint/updateSprint", values)
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
    getUseList = async (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserList", params)
        if (data.code === 0) {
            this.uselist = data.data;
        }
        return data;
    }

    /**
     * 查找全部迭代状态
     */
    @action
    findAllSprintState = async () => {
        const data = await Service("/sprintState/findAllSprintState")
        if (data.code === 0) {
            this.sprintStateList = data.data;
        }
        return data;
    }

    /**
     * 添加迭代关注
     * @param {*} value 
     * @returns 
     */
    @action
    createSprintFocus = async (value) => {
        const data = await Service("/sprintFocus/createSprintFocus", value)
        return data;
    }

    /**
     * 查找迭代列表
     * @param {*} value 
     * @returns 
     */
    @action
    findSprintFocusList = async (value) => {
        const data = await Service("/sprintFocus/findSprintFocusList", value)
        return data;
    }

    /**
     * 取消关注
     * @param {*} value 
     * @returns 
     */
    @action
    deleteSprintFocus = async (value) => {
        const data = await Service("/sprintFocus/deleteSprintFocusByQuery", value)
        return data;
    }

    /**
     * 创建最近点击的
     * @param {最近点击的} value 
     * @returns 
     */
    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;
    }
}

export default new SprintStore();