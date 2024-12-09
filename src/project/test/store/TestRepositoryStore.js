import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class TestRepositoryStore {
    @observable testCaseList = [];
    @observable testCaseCondition = {
        orderParams: [{
            name: "id",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        }
    }

    @action
    findAllRepository = async(params) => {
        const data = await Service("/testrepository/findAllRepository", params)
        return data;
    }

    @action
    createProjectTestRepository = async(params) => {
        const data = await Service("/projectTestRepository/createProjectTestRepository", params)
        return data;
    }

    @action
    findProjectTestRepositoryList = async(params) => {
        const data = await Service("/projectTestRepository/findProjectTestRepositoryList", params)
        return data;
    }

    
    @action
    findUnProjectTestRepository = async(params) => {
        const value = new FormData();
        value.append("projectId", params.projectId)
        const data = await Service("/projectTestRepository/findUnProjectTestRepository", value)
        return data;
    }

    @action
    deleteProjectTestRepositoryByCondition = async(params) => {
        const value = new FormData();
        value.append("projectId", params.projectId)
        value.append("repositoryId", params.repositoryId)
        const data = await Service("/projectTestRepository/deleteProjectTestRepositoryByCondition", value)
        return data;
    }
    
    @action
    findSystemUrl = async(params) => {
        const data = await Service("/systemUrl/findSystemUrlList", params)
       
        return data;
    }

    @action
    findWorkTestCasePage = async(value) => {
        Object.assign(this.testCaseCondition, value)
        const data = await Service("/workTestCase/findWorkTestCasePage", this.testCaseCondition)
        if(data.code === 0){
            this.testCaseList = data.data.dataList;
            this.testCaseCondition.pageParam.totalPage = data.data.totalPage;
            this.testCaseCondition.pageParam.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    deleteWorkTestCase = async(params) => {
        const value = new FormData();
        value.append("id", params.id)
        const data = await Service("/workTestCase/deleteWorkTestCase", value)
        return data;
    }
}

export default new TestRepositoryStore();