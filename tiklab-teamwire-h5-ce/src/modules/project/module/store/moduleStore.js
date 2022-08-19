/*
 * @Descripttion: 
 * @milestone: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:20:36
 */
import { observable, action } from "mobx";
import { FindModuleList, CreateModule,FindDmUserPage } from "../api/module";

export class ModuleStore {

    @action
    findModuleList = async (value) => {
        let data = await FindModuleList(value);
        return data;
    }

    @action
    createModule = async (value) => {
        let data = await CreateModule(value);
        return data;
    }

    @action
    getUseList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await FindDmUserPage(params);
        return data;
    }
}
export const MODULE_STORE = "moduleStore"