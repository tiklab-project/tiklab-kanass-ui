/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:18:42
 * @Description: 项目修改store
 */

import { observable, action } from "mobx";
import { Service } from "../../../../common/utils/requset";
export class ProjectBasicInfoStore {
    @action
    creatIcon = async (value) => {
        const data = await Service("/icon/createIcon", value)
        return data;

    }

    @action
    findIconList = async (params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }

    @action
    findDmUserList = async (params) => {
        const data = await Service("/dmUser/findDmUserList", params)
        return data;
    }
}

export default new ProjectBasicInfoStore();