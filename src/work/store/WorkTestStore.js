/*
 * @Descripttion: 测试用例接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:22:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:20:43
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";
export class WorkTestStore {
    @observable workDoucumentList = [];
    @observable doucumentList = [];

    @observable findDoucmnetCondition = {
        currentPage: 1  
    };

    @observable unRelationWorkCondition = {
        pageParam: {
            currentPage: 1,
            pageSize: 1
        }
    };
    @observable unRelationTotal = 0;

    // 获取事项的测试用例列表
    @action
    findTestCasePageByWorkItemId = async(value) => {
        const params = new FormData()
        params.append("workItemId", value.workItemId)
        if(value.name){
            params.append("name", value.name)
        }
        const data = await Service("/workTestCase/findTestCasePageByWorkItemId", params)
        return data.data;
    }


 
    // 获取未被当前事项关联的测试用例列表
    @action
    findUnRelationWorkTestCaseList = async(value) => {
        Object.assign(this.unRelationWorkCondition, {...value}) 
        const data = await Service("/workTestCase/findUnRelationWorkTestCaseList", this.unRelationWorkCondition)
        
        if(data.code === 0) {
            this.unRelationTotal = data.data.totalRecord;
        }
        return data;
    }

    // 关联测试用例
    @action
    createWorkTestCase = async(params) => {
        const data = await Service("/workTestCase/createWorkTestCase", params)
        return data;
    }

    // 获取测试用例库列表
    @action
    findProjectTestRepositoryList = async(params) => {
        const data = await Service("/projectTestRepository/findProjectTestRepositoryList", params)
        return data;
    }

    // 删除测试用例与事项的关联关系
    @action
    deleteWorkTestCaseRele = async(param) => {
        const data = await Service("/workTestCase/deleteWorkTestCaseList", param)
        return data;
    }

    // 获取设置的用例系统地址
    @action
    findSystemUrl = async(params) => {
        const data = await Service("/systemUrl/findSystemUrlList", params)
        let urlData;
        if(data.code === 0 && data.data.length > 0){
            urlData = data.data[0]
        }
        return urlData;
    }

    // 获取测试用例库成员列表
    @action
    findTesthuboRepositoryUserList = async(value) => {
        const params = {
            repositoryIds: value
        }
        const data = await Service("/workTestCase/findTesthuboRepositoryUserList", params)

        return data;
    }
}
export default new WorkTestStore();