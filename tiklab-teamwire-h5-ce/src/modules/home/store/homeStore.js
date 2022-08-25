import { observable, action } from "mobx";
import { StatProjectWorkItem } from "../api/home"
export class HomeStore {
    @observable ProjectList = [];
    @observable activeIndex = [];

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
}

export const HOME_STORE = "homeStore"