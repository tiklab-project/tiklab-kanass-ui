import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class WikiRepositoryStore {
    @observable documentCondition = {
        orderParams: [{
            name: "id",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1
        }
    }

    @observable documentList = [];
    @action
    findAllRepository = async(params) => {
        const data = await Service("/wikirepository/findAllRepository", params)
        return data;
    }

    @action
    createProjectWikiRepository = async(params) => {
        const data = await Service("/projectWikiRepository/createProjectWikiRepository", params)
        return data;
    }

    @action
    findProjectWikiRepositoryList = async(params) => {
        const data = await Service("/projectWikiRepository/findProjectWikiRepositoryList", params)
        return data;
    }

    @action
    findWorkItemDocumentPage = async(value) => {
        Object.assign(this.documentCondition, value)
        const data = await Service("/workItemDocument/findWorkItemDocumentPage", this.documentCondition)
        if(data.code === 0){
            this.documentList = data.data.dataList;
            this.documentCondition.pageParam.totalPage = data.data.totalPage;
        }
        return data;
    }
    
    @action
    findUnProjectWikiRepository = async(params) => {
        const value = new FormData();
        value.append("projectId", params.projectId)
        const data = await Service("/projectWikiRepository/findUnProjectWikiRepository", value)
        return data;
    }

    @action
    deleteProjectWikiRepositoryByCondition = async(params) => {
        const value = new FormData();
        value.append("projectId", params.projectId)
        value.append("repositoryId", params.repositoryId)
        const data = await Service("/projectWikiRepository/deleteProjectWikiRepositoryByCondition", value)
        return data;
    }

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
    deleteWorkItemDocument = async(params) => {
        const value = new FormData();
        value.append("id", params.id)
        const data = await Service("/workItemDocument/deleteWorkItemDocument", value)

        return data;
    }
}

export default new WikiRepositoryStore();