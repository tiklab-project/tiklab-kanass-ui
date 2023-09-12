/*
 * @Descripttion: 版本store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class VersionStore {
    // 版本列表
    @observable
    versionList = [];

    @observable
    versionFocusList = [];
    // 版本信息
    @observable versionItem = [];
    // 搜索版本的标题
    @observable searchVersionName = [];
    // 查找版本的分页参数
    @observable
    searchCondition = {
        sortParams: [{
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };
    // 版本id
    @observable versionId = "";

    // 迭代查询分页参数
    @observable
    versionFocusParams = {
        orderParams: [{
            name: "name",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };

    /**
     * 设置版本id
     * @param {版本id} value 
     */
    @action
    getVersionId = (value) => {
        this.versionId = value
    }

    /**
     * 查找项目下的版本
     * @param {项目id} value 
     * @returns 
     */
    @action
    getVersionList = async (value) => {
        Object.assign(this.searchCondition, { ...value })
        const data = await Service("/projectVersion/findVersionPage", this.searchCondition)
        if (data.code === 0) {
            this.versionList = data.data.dataList
        }
        return data;
    }

    /**
     * 添加版本
     * @param {版本信息} value 
     * @returns 
     */
    @action
    addVersion = async (value) => {
        let params = {
            name: value.name,
            versionState: value.versionState,
            publishDate: value.publishDate,
            startTime: value.startTime,
            project: {
                id: value.project
            }
        }
        const data = await Service("/projectVersion/createVersion", params)
        return data;

    }

    /**
     * 删除版本
     * @param {版本id} params 
     */
    @action
    deleVersion = async (value) => {
        const param = new FormData()
        param.append("id", value)

        const data = await Service("/projectVersion/deleteVersion", param)
        if (data.code === 0) {
            this.getVersionList()
        }
        return data;
    }

    /**
     * 根据id查找版本
     * @param {版本id} params 
     * @returns 
     */
    @action
    searchVersionById = async (params) => {

        const param = new FormData()
        param.append("id", params.id)
        const data = await Service("/projectVersion/findVersion", params);
        if (data.code === 0) {
            this.versionItem = data.data;
        }
        return data;
    }

    /**
     * 修改版本
     * @param {版本信息} value 
     * @returns 
     */
    @action
    editVersion = async (value) => {
        let params = {
            id: value.id,
            name: value.name,
            publishDate: value.publishDate,
            startTime: value.startTime,
            project: {
                id: value.project
            },
            versionState: value.versionState
        }
        const data = await Service("/projectVersion/updateVersion", params);
        return data;
    }

    /**
     * 根据id查找版本
     * @param {版本id} value 
     * @returns 
     */
    @action
    findVersion = async (value) => {
        const params = new FormData();
        params.append("id", value)
        const data = await Service("/projectVersion/findVersion", params);
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

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;
    }

    @action
    findVersionFocusList = async (value) => {
        Object.assign(this.versionFocusParams, { ...value })
        const data = await Service("/versionFocus/findVersionFocusList", value)

        return data;
    }

    @action
    findFocusVersionList = async (value) => {
        Object.assign(this.versionFocusParams, { ...value })
        const data = await Service("/projectVersion/findVersionFocusList", value)
        if (data.code === 0) {
            this.versionList = data.data;
        }
        return data;
    }

    // @action
    // findFocusSprintList = async (value) => {
    //     Object.assign(this.sprintPageParams, { ...value })
    //     const data = await Service("/sprint/findFocusSprintList", this.sprintPageParams)
    //     if (data.code === 0) {
    //         this.sprintlist = data.data;
    //     }
    //     return data.data;
    // }

    /**
     * 添加迭代关注
     * @param {*} value 
     * @returns 
     */
    @action
    createVersionFocus = async (value) => {
        const data = await Service("/versionFocus/createVersionFocus", value)
        return data;
    }

    /**
     * 取消关注
     * @param {*} value 
     * @returns 
     */
    @action
    deleteVersionFocus = async (value) => {
        const data = await Service("/versionFocus/deleteVersionFocusByQuery", value)
        return data;
    }

}
export default new VersionStore();