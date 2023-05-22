import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class TestRepositoryStore {

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
}

export const TESTREPOSITORY_STORE = "testRepositoryStore";