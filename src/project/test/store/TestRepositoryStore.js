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

    @observable testPlanList = [];
    @observable testPlanCondition = {
        orderParams: [{
            name: "id",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
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

    @action
    findProjectTestRepositoryPlanPage = async(value) => {
        Object.assign(this.testPlanCondition, value)
        const data = await Service("/projectTestRepositoryPlan/findProjectTestRepositoryPlanPage", this.testPlanCondition)
        if(data.code === 0){
            this.testPlanList = data.data.dataList;
            this.testPlanCondition.pageParam.totalPage = data.data.totalPage;
            this.testPlanCondition.pageParam.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    findAllTestPlan = async(id) => {
        const value = new FormData();
        console.log("参数：  ", id)
        value.append("repositoryId", id)
        const data = await Service("/projectTestRepositoryPlan/findAllProjectTestRepositoryPlanByRepositoryId", value)
        return data;
    }

    @action
    findAllProjectTestRepositoryPlan = async (projectId, repositoryId) => {
        const params = new FormData();
        params.append("projectId", projectId);
        params.append("testRepositoryId", repositoryId);
        const data = await Service("/projectTestRepositoryPlan/findProjectTestRepositoryPlanList", params);
        return data;
    }

    @action
    createProjectTestRepositoryPlan = async (params) => {
        const data = await Service("/projectTestRepositoryPlan/createProjectTestRepositoryPlan", params);
        return data;
    };

    @action
    deleteProjectTestRepositoryPlanByCondition = async (projectId, repositoryId, planId) => {
        const value = new FormData();
        value.append("repositoryId", repositoryId);
        value.append("planId", planId);
        value.append("projectId", projectId);
        const data = await Service("/projectTestRepositoryPlan/deleteProjectTestRepositoryPlanByCondition", value);
        return data;
    }

    @action
    deleteProjectTestRepositoryPlan = async(id) => {
        const value = new FormData();
        value.append("id", id)
        const data = await Service("/projectTestRepositoryPlan/deleteProjectTestRepositoryPlan", value)
        return data;
    }
}

export default new TestRepositoryStore();