/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-29 13:28:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:14:50
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";
export class WorkWikiStore {
    @observable workDoucumentList = [];
    @observable doucumentList = [];

    @observable findDoucmnetCondition = {
        currentPage: 1  
    };

    @observable unRelationWorkCondition = {};

    @action
    findDocumentPageByWorkItemId = async(value) => {
        const params = new FormData()
        params.append("workItemId", value.workItemId)
        if(value.name){
            params.append("name", value.name)
        }
        const data = await Service("/workItemDocument/findDocumentPageByWorkItemId", params)
        return data.data;
    }

    @action
    findDocumentPage = async(value) => {
        Object.assign(this.findDoucmnetCondition, {...value})
        const params={
            repositoryId: this.findDoucmnetCondition.repositoryId,
            repositoryIds: this.findDoucmnetCondition.repositoryIds,
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
        const data = await Service("/workItemDocument/findWorkItemDocumentPage", params)
        return data;
    }

    @action
    findRepositoryDocumentList = async(value) => {
        const params={
            repositoryId: value.repositoryId,
            name: value.name
        }
        const data = await Service("/wikidocument/findDocumentList", params)
        return data;
    }

    @action
    findUnRelationWorkDocumentList = async(value) => {
        // const params={
        //     repositoryId: value.repositoryId,
        //     workItemId: value.workItemId,
        //     repositoryIds: value.repositoryIds,
        // }
        Object.assign(this.unRelationWorkCondition, {...value}) 
        const data = await Service("/wikidocument/findUnRelationWorkDocumentList", this.unRelationWorkCondition)
        return data;
    }

    @action
    createWorkItemDocument = async(params) => {
        const data = await Service("/workItemDocument/createWorkItemDocument", params)
        return data;
    }

    @action
    getRepositoryAllList = async(params) => {
        const data = await Service("/wikirepository/findAllRepository", params)
        return data;
    }

    @action
    findProjectWikiRepositoryList = async(params) => {
        const data = await Service("/projectWikiRepository/findProjectWikiRepositoryList", params)
        return data;
    }

    @action
    deleteWorkItemDocument = async(param) => {
        const data = await Service("/workItemDocument/deleteWorkItemDocumentRele", param)
        return data;
    }

    /**
     * 获取知识库的地址
     * @param {*} param 
     * @returns 
     */
    @action
    findSystemUrl = async() => {
        const data = await Service("/systemUrl/findSystemUrl")
        return data;
    }
}
export const WORKWIKI_STORE = "workWikiStore"