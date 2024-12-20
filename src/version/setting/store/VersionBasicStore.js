/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:35:31
 * @Description: 版本信息接口
 */

import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"

export class VersionBasicStore {
    @observable useList = [];
    @observable status = [];
    
    @action
    findVersion = async (values) => {

        const param = new FormData()
        param.append("id", values)
        const data = await Service("/projectVersion/findVersion", param)
        if (data.code === 0) {
            return data;
        }
    }

    @action
    updateVersion = async(values) => {
        const data = await Service("/projectVersion/updateVersion", values)
        return data;
    }

    @action
    findAllVersionState = async() => {
        const data = await Service("/versionState/findAllVersionState")
        this.status = data.data
        return data;
    }

    @action
    deleteVersion = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await Service("/projectVersion/deleteVersion", param)
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
    findSelectVersionList = async(values) => {
        const data = await Service("/projectVersion/findSelectVersionList", values)
        return data;
    }
    
}

export default new VersionBasicStore();