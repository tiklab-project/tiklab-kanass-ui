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
    // 版本信息
    @observable versionItem = [];
    // 搜索版本的标题
    @observable searchVersionName = [];
    // 查找版本的分页参数
    @observable 
    searchCondition = {
        currentPage: 1
    };
    // 版本id
    @observable versionId = "";

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
	getVersionList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            projectId: this.searchCondition.projectId,
            name: this.searchCondition.name,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/projectVersion/findVersionPage", params)
        if(data.code === 0){
            
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
	addVersion = async(value) => {
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
	deleVersion = async(value) => {
        const param = new FormData()
        param.append("id", value)

        const data = await Service("/projectVersion/deleteVersion", param)
        if(data.code=== 0 ){
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
	searchVersionById = async(params) => {
        
        const param = new FormData()
        param.append("id", params.id)
        const data = await Service("/projectVersion/findVersion", params);
        if(data.code === 0){
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
	editVersion = async(value) => {
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
    findVersion = async(value) => {
        const params = new FormData();
        params.append("id",value)
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
}
export default new VersionStore();