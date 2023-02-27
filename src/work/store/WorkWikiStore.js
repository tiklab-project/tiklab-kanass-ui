/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-29 13:28:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:14:50
 */
import { observable, action } from "mobx";
import { FindDocumentList,CreateWorkItemDocument,GetWikiAllList,DeleteWorkItemDocument,FindDocumentPageByItemId } from "../api/WorkWikiApi"
export class WorkWikiStore {
    @observable workDoucumentList = [];
    @observable doucumentList = [];

    @observable findDoucmnetCondition = {
        currentPage: 1  
    };

    @observable findWorkDoucmnetCondition = {
        currentPage: 1  
    };

    @action
    findDocumentPageByItemId = (value) => {
        const params = new FormData()
        params.append("workItemId", value.workItemId)
        if(value.name){
            params.append("name", value.name)
        }
        return new Promise((resolve,reject)=> {
            FindDocumentPageByItemId(params).then(response => {
                resolve(response.data) 
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    @action
    findDocumentPage = (value) => {
        Object.assign(this.findDoucmnetCondition, {...value})
        const params={
            repositoryId: this.findDoucmnetCondition.repositoryId,
            name: this.findDoucmnetCondition.name,
            workItemId: this.findDoucmnetCondition.workItemId,
            sortParams: [{
                name: "name",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.findDoucmnetCondition.currentPage
            }
        }
        return new Promise((resolve,reject)=> {
            FindDocumentList(params).then(response => {
                resolve(response.data.dataList) 
                
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }
    @action
    createWorkItemDocument = async(params) => {
        const data = await CreateWorkItemDocument(params);
        return data;
    }

    @action
    getWikiAllList = async(params) => {
        const data = await GetWikiAllList(params)
        return data.data;
    }

    @action
    deleteWorkItemDocument = async(param) => {
        const data = await DeleteWorkItemDocument(param)
        return data;
    }
}
export const WORKWIKI_STORE = "workWikiStore"