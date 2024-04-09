/*
 * @Descripttion: 计划的store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import { observable, action, extendObservable } from "mobx";
import { Service } from "../../../common/utils/requset"
export class StageStore {
    // 成员列表
    @observable 
    useList = [];

    @observable workTypeList = [];
    // 搜索参数
    @observable 
    searchCondition = {
        orderParams: [{
            title: "标题",
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };

    @observable
    stageCondition = {
        orderParams: [{
            name: "startTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    }

    @observable
    stageList = [];

    @observable
    parentStageList = [];

    @observable
    parentCondition = {
        orderParams: [{
            name: "startTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    }
    
    /**
     * 创建计划
     * @param {计划信息} param 
     * @returns 
     */
    @action
	createStage = async(param) => {
        const data = await Service("/stage/createStage", param)
        return data;
    }

    /**
     * 获取项目成员
     * @param {项目id} value 
     */
    @action
    getUseList = async(value) => {
        const params = {
            domainId: value.projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        if(data.code === 0){
            this.useList = data.data.dataList
        }
        return data;
    }

    /**
     * 根据条件查找计划列表
     * @param {} value 
     * @returns 
     */
    @action
    findStageList = async(value) => {
        const data = await Service("/stage/findStageListTree", value)
        if(data.code === 0){
            return data;
        }
    }

    @action
    findStageListTreePage= async(value) => {
        Object.assign(this.stageCondition, value)
        const data = await Service("/stage/findStageListTreePage", this.stageCondition)
        if(data.code === 0){
           this.stageList = data.data.dataList;
        }
        return data;
    }
    /**
     * 根据id查找计划信息
     * @param {计划id} value 
     * @returns 
     */
    @action
    findStage = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/stage/findStage", params);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 按照分页查找计划
     * @param {条件} value 
     * @returns 
     */
    @action
    findWorkItemPageTreeByQuery = async(value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
        const data = await Service("/workItem/findWorkItemListTree", this.searchCondition);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 创建事项计划关联
     * @param {事项id,计划id} value 
     * @returns 
     */
    @action
    createStageWorkItem = async(value) => {
        const data = await Service("/stageWorkItem/createStageWorkItem", value);
        if(data.code === 0){
            return data;
        }
    }
    
    /**
     * 根据条件查找计划的事项列表
     * @param {*} value 
     * @returns 
     */
    @action
    findWorkItemListByStage = async(value) => {
        const data = await Service("/stageWorkItem/findStageChildWorkItemAndStage", value);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 根据条件删除计划事项关联
     * @param {*} value 
     * @returns 
     */
    @action
    deleteStageWorkItem = async(value) => {
        const data = await Service("/stageWorkItem/deleteStageWorkItemCondition", value);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 更新计划信息
     * @param {计划信息} value 
     * @returns 
     */
    @action
    updateStage = async(value) => {
        const data = await Service("/stage/updateStage", value);
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 删除计划
     * @param {计划id} value 
     * @returns 
     */
    @action
    deleteStage = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await Service("/stage/deleteStage", params);
        if(data.code === 0){
            return data;
        }
    }

    // @action
    // getWorkTypeList = async(value) => {
    //     const data = await Service("/workTypeDm/findWorkTypeDmList",value);
    //     if(data.code === 0){
    //         this.workTypeList = data.data;
    //     }
    //     return data.data;
    // }

    @action
    findWorkTypeDmList = async(value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList",value);
        if(data.code === 0){
            this.workTypeList = data.data;
        }
        return data.data;
    }

    @action
    findParentStageList = async(value) => {
        // const params = new FormData();
        // params.append("id", value.id);
        Object.assign(this.parentCondition,value)
        const data = await Service("/stage/findParentStageList",this.parentCondition);
        if(data.code === 0){
            this.parentStageList = data.data.dataList;
        }
        return data;
    }

}
export default new StageStore();