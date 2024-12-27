/*
 * @Descripttion: 事项文档接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:22:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 09:43:05
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";
export class WorkWikiStore {
    @observable workDoucumentList = [];
    @observable doucumentList = [];
    @observable userList = []
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

    // 获取事项关联的文档列表
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



    // 获取未被当前事项关联的文档列表
    @action
    findUnRelationWorkDocumentList = async(value) => {
   
        Object.assign(this.unRelationWorkCondition, {...value}) 
        const data = await Service("/wikidocument/findUnRelationWorkDocumentList", this.unRelationWorkCondition)
        if(data.code === 0) {
            this.unRelationTotal = data.data.totalRecord;
        }
        return data;
    }

    // 创建事项与文档的关联关系
    @action
    createWorkItemDocument = async(params) => {
        const data = await Service("/workItemDocument/createWorkItemDocument", params)
        return data;
    }

    // 获取知识库列表
    @action
    getRepositoryAllList = async(params) => {
        const data = await Service("/wikirepository/findAllRepository", params)
        return data;
    }

    // 获取知识库成员列表
    @action
    findWikiUserList = async() => {
        const data = await Service("/wikirepository/findWikiUserList")
        return data;
    }

    // 获取项目的知识库列表
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

    //获取知识库的地址
    @action
    findSystemUrl = async(params) => {
        const data = await Service("/systemUrl/findSystemUrlList", params)
        let urlData;
        if(data.code === 0 && data.data.length > 0){
            urlData = data.data[0]
        }
        return urlData;
    }

    // 获取知识库成员列表
    @action
    findRepositoryUserList = async(value) => {
        const params = {
            domainId: value
        }
        const data = await Service("/wikirepository/findRepositoryUserList", params)
        if(data.code === 0){
            this.userList = data.data
        }
        return data;
    }
}
export default new WorkWikiStore();