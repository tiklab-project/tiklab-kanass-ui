/*
 * @Descripttion: 史诗store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 09:18:32
 */
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset"
class EpicStore {
    @observable uselist = [];
    @observable workTypeList = []
    @observable searchCondition = {
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
     * 创建史诗
     * @param {史诗} param 
     * @returns 
     */
    @action
	createEpic = async(param) => {
        const data = await Service("/epic/createEpic", param)
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
            this.uselist = data.data.dataList;
        }
        return data;
    }

    /**
     * 获取史诗列表
     * @param {*} value 
     * @returns 
     */
    @action
    findEpicList = async(value) => {
        const data = await Service("/epic/findEpicListTree", value)
        if(data.code === 0){
            return data
        }
    }

    /**
     * 根据id获取史诗信息
     * @param {史诗id} value 
     * @returns 
     */
    @action
    findEpic = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/epic/findEpic", params)
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 根据条件获取史诗的关联事项树
     * @param {} value 
     * @returns 
     */
    @action
    findWorkItemPageTreeByQuery = async(value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
        const data = await Service("/workItem/findWorkItemListTree", value)
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 创建史诗关联事项
     * @param {*} value 
     * @returns 
     */
    @action
    createEpicWorkItem = async(value) => {
        const data = await Service("/epicWorkItem/createEpicWorkItem", value)
        if(data.code === 0){
            return data;
        }
    }
    
    /**
     * 获取史诗的下级事项列表和史诗
     * @param {*} value 
     * @returns 
     */
    @action
    findEpicChildWorkItemAndEpic = async(value) => {
        const data = await Service("/epicWorkItem/findEpicChildWorkItemAndEpic", value)
        if(data.code === 0){
            return data;
        }
    } 

    /**
     * 根据条件删除史诗
     * @param {*} value 
     * @returns 
     */
    @action
    deleteEpicWorkItem = async(value) => {
        const data = await Service("/epicWorkItem/deleteEpicWorkItemCondition", value)
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 更新史诗
     * @param {*} value 
     * @returns 
     */
    @action
    updateEpic = async(value) => {
        const data = await Service("/epic/updateEpic", value)
        if(data.code === 0){
            return data;
        }
    }

    /**
     * 删除史诗
     * @param {*} value 
     * @returns 
     */
    @action
    deleteEpic = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await Service("/epic/deleteEpic", params)
        if(data.code === 0){
            return data;
        }
    }

    @action
    getWorkTypeList = async(value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList",value);
        if(data.code === 0){
            this.workTypeList = data.data;
        }
        return data.data;
    }
}
export default new EpicStore();