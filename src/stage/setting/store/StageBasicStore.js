import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"

export class StageBasicStore {
    @observable useList = [];
    @observable status = [];

    @action
    findStage = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/stage/findStage", param)
        if (data.code === 0) {
            return data;
        }
    }

   

    @action
    findAllStageState = async() => {
        const data = await Service("/stageState/findAllStageState")
        this.status = data.data
        return data;
    }

    @action
    deleteStage = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await Service("/stage/deleteStage", param)
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
    updataBatchWorkItemStage = async (values) => {
        const data = await Service("/stage/updataBatchWorkItemStage", values)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    updateStage = async(values) => {
        const data = await Service("/stage/updateStage", values)
        return data;
    }

}

export default new StageBasicStore();