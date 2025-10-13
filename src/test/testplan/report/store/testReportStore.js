import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

export class TestReportStore {
    @observable testReportList = [];
    @observable testReportInfo={}

    @action
    findTestReportPage = async (value) => {
        const params = {
            ...value,
        }
        const res = await Axios.post("/testReport/findTestReportPage",params);
        if(res.code === 0) {
            this.testReportList = res.data.dataList;
        }

        return res.data
    }

    @action
    findTestReport = async (id) => {
        const param = new FormData();
        param.append('id', id);
        const res = await Axios.post("/testReport/findTestReport", param);
        if(res.code === 0) {
            this.testReportInfo = res.data;
        }
        return res.data;
    }

    @action
    createTestReport = async (value) => {
        const res = await Axios.post("/testReport/createTestReport", value);
        return res.data;
    }

    @action
    updateTestReport = async (value) => {
        const res = await Axios.post("/testReport/updateTestReport", value);
        return res;
    }

    @action
    deleteTestReport = async (id) => {
        const param = new FormData();
        param.append('id', id);
        await Axios.post("/testReport/deleteTestReport",param)
    }

    @action
    getTestReportSummary = async (id) => {
        const param = new FormData();
        param.append('id', id);
        const res = await Axios.post("/testReport/getTestReportSummary", param);
        return res.data;
    }



}

let testReportStore = new TestReportStore();
export default testReportStore;
