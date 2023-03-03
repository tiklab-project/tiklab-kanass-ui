/*
 * @Descripttion: 项目的事项类型store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import { observable, action } from "mobx";
import {FindWorkTypeDmList,AddWorkTypeList,UpdateWorkTypeDm,
        FindWorkTypeDm,DeleteWorkType,GreatIcon,FindIconList, FindDmFormList, 
        FindDmFlowPage, FindSelectWorkTypeDmList, CreateWorkTypeDm, GetWorkTypeList} from "../api/WorkType";

export class ProjectWorkStore {
    // 所有事项类型列表
    @observable 
    workAllTypeList = [];
    // 已经被项目添加的事项类型列表
    @observable 
    workSelectTypeList = [];
    // 系统的事项类型列表
    @observable 
    workSystemTypeList = [];
    // 表单列表
    @observable 
    formList = [];
    // 流程列表
    @observable 
    flowList = [];
    // 事项类型查找分页参数
    @observable workTypePage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };

    /**
     * 添加系统事项类型到项目下面
     * @param {*} value 
     * @returns 
     */
    @action
	createWorkTypeDm = async(value) => {
        const data = await CreateWorkTypeDm(value);
        if(data.code=== 0){
            return data;
        }
    }

    /**
     * 根据项目id 查找项目的事项类型列表
     * @param {项目id} value 
     */
    @action
	findWorkTypeDmList = async(value) => {
        const params = {
            projectId: value.projectId,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await FindWorkTypeDmList(params);
        if(data.code=== 0){
            this.workAllTypeList = data.data;
        }
    }

    /**
     * 查找没被项目添加的事项类型
     * @param {已经被添加的事项类型ids} value 
     * @returns 
     */
    @action
	findSelectWorkTypeDmList = async(value) => {
        const params = {
            selectIds: value.selectIds,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await FindSelectWorkTypeDmList(params);
        if(data.code=== 0){
            this.workSelectTypeList = data.data;
        }
        return data;
    }

    /**
     * 获取系统事项类型列表
     * @param {事项类型名称} value 
     */
    @action
	getSystemWorkTypeList = async(value) => {
        const params = {
            name: value?.name,
            grouper: "system",
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await GetWorkTypeList(params);
        if(data.code=== 0){
            this.workSystemTypeList = data.data;
        }
    }

    /**
     * 编辑项目的事项类型
     * @param {} value 
     * @returns 
     */
    @action
	editWorkType = async(value) => {
        let params = {
            id: value.id,
            name: value.name,
            form: {
                id: value.form
            },
            flow: {
                id : value.flow
            }
        }
		const data = await UpdateWorkTypeDm(params)

        return data;
    }

    /**
     * 根据id 查找事项类型
     * @param {事项类型id} id 
     * @returns 
     */
    @action
	findWorkTypeDmtById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve,reject)=> {
            FindWorkTypeDm(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }

     /**
      * 根据id删除事项类型
      * @param {事项类型id} value 
      * @returns 
      */
     @action
     deleteWorkTypeCustomList =async(value) => {
        const params = new FormData();
        params.append("id", value.id)
         const data = await DeleteWorkType(params);
         return data;
     }

    /**
     * 设置事项类型
     * @param {事项列表} value 
     */ 
    @action
	setWorkTypeList = (value) => {
        this.workTypelist = [...value]
    }

    /**
     * 查找项目的表单列表
     * @param {项目id} value 
     */
    @action
    getFormList = async(value) => {
        const params = {
            domainId: value.projectId,
            // group: "custom",
            pageParam: {
                pageSize: 10, 
                currentPage: 1
            }
        }
        const data = await FindDmFormList(params)
        console.log(data)
        if(data.code=== 0){
            this.formList = data.data
        }
    }

    /**
     * 查找项目的流程列表
     * @param {项目id} value 
     */
    @action
    getFlowList = async(value) => {
        const params = {
            domainId: value.projectId,
            group: "custom",
            pageParam: {
                pageSize: 10, 
                currentPage: 1
            }
        }
        const data = await FindDmFlowPage(params)
        if(data.code=== 0){
            this.flowList = data.data.dataList
        }
		
    }

    /**
     * 上传icon
     */
    @action
    creatIcon = async(value) => {
        const data = await GreatIcon(value)
        return data;
		
    }
    
    /**
     * 查找所有icon
     */
    @action
    findIconList = async(params) => {
        const data = await FindIconList(params)
        return data;
    }
}
export const PROJECTWORK_STORE = "projectWorkStore"