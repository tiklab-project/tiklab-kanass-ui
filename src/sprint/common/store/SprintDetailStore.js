import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SprintDetailStore {
    @observable sprintList = [];
    @observable sprint = "";

    @action
    findSprintList = async(value) => {
        const data = await Service("/sprint/findSprintList", value)
        if(data.code === 0){
            this.sprintList = data.data
        }
    }

    @action
    findSprint = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/sprint/findSprint", value)
        if(data.code === 0){
            this.sprint = data.data
        }
        return data;
    }
    
}
export const SPRINTDETAIL_STORE = "sprintDetailStore"