import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";


export class TestPlanBindCaseInstanceStore {

    @observable testPlanBindCaseInstanceList = [];
    @observable totalPage;
    @observable tableLoading=true;
    @observable totalRecord


    @action
    findTestPlanBindCaseInstancePage = async (values) => {
        this.tableLoading=true;
        this.params = {
            orderParams:[{name:'id', orderType:'desc' }],
            ...values,
        }

        const res = await Axios.post("/testPlanCaseInstanceBind/findTestPlanCaseInstanceBindPage",this.params );
        if(res.code === 0) {
            this.testPlanBindCaseInstanceList = res.data.dataList;
            this.totalRecord = res.data.totalRecord;
            this.totalRecord= res.data.totalRecord;
            this.tableLoading=false
        }
        return res
    }

    @action
    findTestPlanBindCaseInstanceList = async (id) =>{
        let param = {
            "testPlanId":id,
            orderParams:[{name:'id', orderType:'desc' }]
        }

        const res = await Axios.post("/testPlanCaseInstanceBind/findTestPlanCaseInstanceBindList",param);
        if(res.code===0){
            this.testPlanBindCaseInstanceList = res.data;
            return res.data;
        }
    }

    @action
    findTestPlanBindCaseInstance = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/testPlanCaseInstanceBind/findTestPlanCaseInstanceBind",param)
        if(res.code === 0){

            return res.data;
        }
    }


    @action
    deleteTestPlanBindCaseInstance = async (id) => {
        const param = new FormData();
        param.append('id', id);

        await Axios.post("/testPlanCaseInstanceBind/deleteTestPlanCaseInstanceBind",param)
    }


}


let testPlanBindCaseInstanceStore = new TestPlanBindCaseInstanceStore();
export default testPlanBindCaseInstanceStore;