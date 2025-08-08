import {observable,action} from "mobx";
import {Axios} from "tiklab-core-ui";


export class TestPlanDetailStore {
    @observable testPlanDetailList = [];
    @observable testPlanDetailInfo = {};
    @observable totalRecord ;
    @observable testPlanTestcaseList=[];
    @observable testCaseList=[]

    @action
    findBindTestCasePage = async (param) => {
        const params = {
            ...param,
            orderParams: [{name:'id', orderType:'desc'}],
        };
        const res = await Axios.post("/testPlanCase/findPlanCasePage",params)
        if(res.code === 0) {
            this.totalRecord = res.data.totalRecord;
            this.testPlanDetailList = res.data.dataList;
            return  res.data
        }
    }


    //点击添加用例，弹框中的查询
    @action
    findTestCasePage = async (values) =>{
        const res = await Axios.post("/testPlanCase/findTestCasePage",values)
        if(res.code === 0) {
            this.testCaseList=res.data.dataList
            return res.data
        }
    }

    @action
    planBindCase = async (values) => await Axios.post("/testPlanCase/planBindCase",values)

    @action
    updateTestPlanDetail = async (values) => await Axios.post("/testPlanCase/updateTestPlanCase",values)

    @action
    deleteTestPlanDetail = async (id) => {
        const param = new FormData();
        param.append('id', id)

        await Axios.post("/testPlanCase/deleteTestPlanCase",param)
    }

    @action
    getCaseTypeNum = async (id) =>{
        const param = new FormData();
        param.append('testPlanId', id)

        const res = await Axios.post("/testPlanCase/getCaseTypeNum",param)
        if(res.code === 0) {
            return res.data
        }
    }

    @action
    getTestTypeNum = async (id) =>{
        const param = new FormData();
        param.append('testPlanId', id)

        const res = await Axios.post("/testPlanCase/getTestTypeNum",param)
        if(res.code === 0) {
            return res.data
        }
    }


}

let testPlanDetailStore = new TestPlanDetailStore();
export default testPlanDetailStore;
