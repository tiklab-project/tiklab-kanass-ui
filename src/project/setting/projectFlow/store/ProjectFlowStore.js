/*
 * @Descripttion: 模块接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 17:27:13
 */
import { observable, action, values } from "mobx";
import { Service } from "../../../../common/utils/requset"
export class ProjectFlowStore {
    // 模块列表
    @observable 
    userList = [];

    /**
     * 获取模块列表
     */
    @action
	getUserList = async(value) => {
        const params = {
            domainId: value.projectId
        }
        const data = await Service("/dmUser/findDmUserList", params)
        if(data.code=== 0){
            this.userList = data.data;
        }
        return data;
    }
}

export default new ProjectFlowStore();