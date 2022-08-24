/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-10 15:56:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-10 16:51:01
 */
import { observable, action} from "mobx";
import { FindUser, FindAllProjectType, FindAllWorkPriority, FindAllWorkType} from "../api/systemSet"
export class SystemSetStore {

    @action
    findUser = async(value)=> {
        const params = new FormData();
        params.append("id", value)

        const data = await FindUser(params);
        return data;
    }

    @action
    findAllProjectType = async()=> {
        const data = await FindAllProjectType();
        return data;
    }

    @action
    findAllWorkPriority = async()=> {
        const data = await FindAllWorkPriority();
        return data;
    }

    @action
    findAllWorkType = async()=> {
        const data = await FindAllWorkType();
        return data;
    }
}

export const SYSTEMSET_STORE = "systemSetStore"