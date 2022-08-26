import { observable, action } from "mobx";
import { StatProjectWorkItem, StatWorkItemProcess, FindDynamicPage } from "../api/home"
export class HomeStore {
    @observable ProjectList = [];
    @observable activeIndex = "project";

    @action
    setActiveIndex = (value) => {
        this.activeIndex = value
    }
    
    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("recentMasterId",value)
		const data = await StatProjectWorkItem(params);
        return data;
    }

    @action
	statWorkItemProcess = async() => {
		const data = await StatWorkItemProcess();
        return data;
    }

    @action
    findDynamicPage = async(value)=> {
        const params={
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await FindDynamicPage(params);
        return data;
    }

}

export const HOME_STORE = "homeStore"