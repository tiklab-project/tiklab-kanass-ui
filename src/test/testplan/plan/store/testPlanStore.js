import {observable,action} from "mobx";
import {Axios} from "tiklab-core-ui";


export class TestPlanStore {
    @observable testPlanList = [];
    @observable testPlanInfo = {};
    @observable totalPage ;
    @observable testDrawerVisible=false;
    @observable TestPlanTestType;

    @action
    findTestPlanPage = async (param) => {
        const params = {
            ...param,
            orderParams: [{name:'name', orderType:'asc'}],
        };
        const res = await Axios.post("/testPlan/findTestPlanPage",params)
        if(res.code === 0) {
            this.totalPage = res.data.totalPage;
            this.testPlanList = res.data.dataList;
            return res.data
        }
    }

    @action
    findTestPlan = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/testPlan/findTestPlan",param)
        if(res.code === 0){
            this.testPlanInfo = res.data;
            this.TestPlanTestType = res.data.type
            return res.data;
        }
    }

    @action
    createTestPlan = async (values) => await Axios.post("/testPlan/createTestPlan",values)

    @action
    updateTestPlan = async (values) => await Axios.post("/testPlan/updateTestPlan",values)

    @action
    deleteTestPlan = async (id) => {
        const param = new FormData();
        param.append('id', id);

         await Axios.post("/testPlan/deleteTestPlan",param)
    }

    @action
    setTestDrawerVisible = (visible) =>{
        this.testDrawerVisible = visible
    }

}

let testPlanStore = new TestPlanStore()
export default testPlanStore;
