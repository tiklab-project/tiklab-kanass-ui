/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-29 13:28:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:14:50
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";
export class WorkRepositoryStore {
    @observable workDoucumentList = [];
    @observable doucumentList = [];

    @observable findDoucmnetCondition = {
        currentPage: 1  
    };

    @observable findWorkDoucmnetCondition = {
        currentPage: 1  
    };

    @action
    findDocumentPageByItemId = async(value) => {
        const params = new FormData()
        params.append("workItemId", value.workItemId)
        if(value.name){
            params.append("name", value.name)
        }
        const data = await Service("/workItemDocument/findDocumentPageByItemId", params)
        return data.data;
    }

    @action
    findDocumentPage = async(value) => {
        Object.assign(this.findDoucmnetCondition, {...value})
        const params={
            repositoryId: this.findDoucmnetCondition.repositoryId,
            name: this.findDoucmnetCondition.name,
            workItemId: this.findDoucmnetCondition.workItemId,
            sortParams: [{
                name: "name",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.findDoucmnetCondition.currentPage
            }
        }
        const data = await Service("/workItemDocument/findDocumentPageByItemId", params)
        return data.data;
    }
    @action
    createWorkItemDocument = async(params) => {
        const data = await Service("/workItemDocument/createWorkItemDocument", params)
        return data;
    }

    @action
    getRepositoryAllList = async(params) => {
        const data = await Service("/api/kanass/repository/findAllRepository", params)
        return data.data;
    }

    @action
    deleteWorkItemDocument = async(param) => {
        const data = await Service("/workItemDocument/deleteWorkItemDocumentRele", param)
        return data;
    }
}
export const WORKREPOSITORY_STORE = "workRepositoryStore"