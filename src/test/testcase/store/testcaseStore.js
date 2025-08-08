import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";


export class TestCaseStore {
    @observable testcaseList = [];
    @observable tabList = [];
    @observable currentPage=1;
    @observable createUserAndDirectorNum={}

    @action
    findTestCaseList = async (values) => {
        const res = await Axios.post("/testCase/findTestCasePage", values);

        if (res.code === 0) {
            this.testcaseList = res.data.dataList;
            return res.data
        }
    }

    @action
    findDiffTestCaseNum = async (values) => {
        const res = await Axios.post("/testCase/findDiffTestCaseNum", values);
        if (res.code === 0) {
            return res.data
        }
    }


    @action
    findTestCase = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/testCase/findTestCase", param);
        if (res.code === 0) {
            return res.data;
        }
    }

    @action
    setCurrentPage = (page) => {
        this.currentPage = page;
    }

    @action
    findDiffTypeCaseNum = async (projectId) => {
        const param = new FormData();
        param.append('projectId', projectId);

        const res = await Axios.post("/testCase/findDiffTypeCaseNum",param)
        if(res.code === 0){
            return res.data;
        }
    }

    @action
    findCreateUserAndDirectorNum = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/testCase/findCreateUserAndDirectorNum",param)
        if(res.code === 0){
            this.createUserAndDirectorNum = res.data;
            return res.data;
        }
    }


    @action
    createTestCase = async (values) => await Axios.post("/testCase/createTestCase", values)

    @action
    updateTestCase = async (values) => await Axios.post("/testCase/updateTestCase", values)

    @action
    deleteTestCase = async (id,caseType) => {
        const param = new FormData();
        param.append('id', id);
        param.append('caseType', caseType);

        await Axios.post("/testCase/deleteTestCase", param)
    }


    /**
     * 设置最近访问的用例
     */
    @action
    testCaseRecent = async (values) => {
        const res = await Axios.post("/testCaseRecent/testCaseRecent", values);
        if (res.code === 0) {
            return res.data;
        }
    }


    /**
     * 判断用例是否被绑定
     * @param id
     * @returns {Promise<void>}
     */
    @action
    isCaseExist = async (id) => {
        const param = new FormData();
        param.append('caseId', id);

        const res = await Axios.post("/testPlanCase/isCaseExist", param)
        if (res.code === 0) {
            return res.data;
        }
    }

    /**
     * 判断接口单元用例是否被绑定
     * 接口场景、测试计划 两处
     * @param id
     * @returns {Promise<void>}
     */
    @action
    isApiUnitBind = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/apiUnitCase/isApiUnitBind", param)
        if (res.code === 0) {
            return res.data;
        }
    }

    /**
     * 判断接口场景用例是否被绑定
     * 接口性能、测试计划 两处
     * @param id
     * @returns {Promise<void>}
     */
    @action
    isApiSceneBind = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/apiSceneCase/isApiSceneBind", param)
        if (res.code === 0) {
            return res.data;
        }
    }

}

const testcaseStore = new TestCaseStore();
export default testcaseStore
