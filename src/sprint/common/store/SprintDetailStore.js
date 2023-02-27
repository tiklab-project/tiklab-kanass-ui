import { observable, action } from "mobx";
import { FindSprintList, FindSprint } from "../api/sprintApi"

export class SprintDetailStore {
    @observable sprintList = [];
    @observable sprint = "";

    @action
    findSprintList = async(value) => {
        const data = await FindSprintList(value)
        if(data.code === 0){
            this.sprintList = data.data
        }
    }

    @action
    findSprint = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await FindSprint(params)
        if(data.code === 0){
            this.sprint = data.data
        }
        return data;
    }
    
}
export const SPRINTDETAIL_STORE = "sprintDetailStore"