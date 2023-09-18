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

    @observable unRelationWorkCondition = {
        pageParam: {
            currentPage: 1,
            pageSize: 10
        }
    };
    @observable unRelationTotal = 0;
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
            orderParams: [{
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
   
        Object.assign(this.unRelationWorkCondition, {...value}) 
        const data = await Service("/wikidocument/findUnRelationWorkDocumentList", this.unRelationWorkCondition)
        if(data.code === 0) {
            this.unRelationTotal = data.data.totalRecord;
        }
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
    findWikiUserList = async() => {
        const data = await Service("/wikirepository/findWikiUserList")
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
    findSystemUrl = async(params) => {
        const data = await Service("/systemUrl/findSystemUrlList", params)
        let urlData;
        if(data.code === 0 && data.data.length > 0){
            urlData = data.data[0]
        }
        return urlData;
    }

    @action
    findRepositoryUserList = async(value) => {
        const params = new FormData();
        params.append("repositoryIds", value)
        const data = await Service("/wikirepository/findRepositoryUserList", params)

        return data;
    }
}
export default new WorkWikiStore();