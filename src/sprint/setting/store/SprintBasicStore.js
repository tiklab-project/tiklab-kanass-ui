import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"

export class SprintBasicStore {
    @observable useList = [];
    @observable status = [];

    @action
    findSprint = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/sprint/findSprint", param)
        return data;
    }

   

    @action
    findAllSprintState = async() => {
        const data = await Service("/sprintState/findAllSprintState")
        this.status = data.data
        return data;
    }

    @action
    deleteSprint = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await Service("/sprint/deleteSprint", param)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    getUseList = async (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        if (data.code === 0) {
            this.useList = data.data.dataList;
        }
        return data;
    }

    

    

    @action
    updataBatchWorkItemSprint = async (values) => {
        const data = await Service("/sprint/updataBatchWorkItemSprint", values)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    updateSprint = async(values) => {
        const data = await Service("/sprint/updateSprint", values)
        return data;
    }

}

export default new SprintBasicStore();