/*
 * @Descripttion: 阶段的store
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
    uselist = [];
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

    /**
     * 创建阶段
     * @param {阶段信息} param 
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
            this.uselist = data.data.dataList
        }
        return data;
    }

    /**
     * 根据条件查找阶段列表
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

    /**
     * 根据id查找阶段信息
     * @param {阶段id} value 
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
     * 按照分页查找阶段
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
     * 创建事项阶段关联
     * @param {事项id,阶段id} value 
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
     * 根据条件查找阶段的事项列表
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
     * 根据条件删除阶段事项关联
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
     * 更新阶段信息
     * @param {阶段信息} value 
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
     * 删除阶段
     * @param {阶段id} value 
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

}
export const STAGE_STORE = "stageStore"