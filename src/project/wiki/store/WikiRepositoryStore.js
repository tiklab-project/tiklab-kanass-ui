import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class WikiRepositoryStore {

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
}

export const WIKIREPOSITORY_STORE = "wikiRepositoryStore";