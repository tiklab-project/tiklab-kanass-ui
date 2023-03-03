/*
 * @Descripttion: 版本store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import { observable, action } from "mobx";
import {VersionList,EditVersion,AddVersion,DeleVersion,SearchVersionById,FindVersion} from "../api/Version";

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
		const data = await VersionList(params)
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
	addVersion = (value) => {
        let params = {
            name: value.name,
            versionState: value.versionState,
            publishDate: value.publishDate,
            startTime: value.startTime,
            project: {
                id: value.project
            }
        }
        return new Promise((resolve,reject)=>{
            AddVersion(params).then(response => {
                resolve()
            }).catch(error => {
                reject()
                console.log(error)
            })
        })
		
    }
    
    /**
     * 删除版本
     * @param {版本id} params 
     */
    @action
	deleVersion = (params) => {
        const param = new FormData()
        param.append("id", params.id)


		DeleVersion(param).then(response => {
            if(response.code=== 0 ){
                this.getVersionList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    /**
     * 根据id查找版本
     * @param {版本id} params 
     * @returns 
     */
    @action
	searchVersionById = (params) => {
        
        const param = new FormData()
        param.append("id", params.id)
        return new Promise((resolve,reject)=> {
            SearchVersionById(param).then(response => {
                this.versionItem = response.data;
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
		
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
        const data = await EditVersion(params)
        return data;
    }

    /**
     * 根据id查找版本
     * @param {版本id} value 
     * @returns 
     */
    @action
    findVersion = (value) => {
        const params = new FormData();
        params.append("id",value)
        const data = FindVersion(params);
        return data;
    }
}
export const EDITION_STORE = "versionStore"