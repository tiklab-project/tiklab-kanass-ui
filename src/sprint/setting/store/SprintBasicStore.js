/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 15:34:42
 * @Description: 迭代设置接口
 */

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