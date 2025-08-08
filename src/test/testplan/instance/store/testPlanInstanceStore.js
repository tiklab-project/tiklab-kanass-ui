import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

export class TestPlanInstanceStore {

    @observable testPlanInstanceList = [];
    @observable	totalRecord = "";
    @observable params


    @action
    findTestPlanInstancePage = async (value) => {
        this.params = {
            ...value,
            type:"test-plan",
            orderParams:[{name:'createTime', orderType:'desc' }]
        }

        const res = await Axios.post("/instance/findInstancePage",this.params );
        if(res.code === 0) {
            this.testPlanInstanceList = res.data.dataList;
            this.totalRecord = res.data.totalRecord;
        }
        return res
    }

    @action
    findTestPlanInstance = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/testPlanInstance/findTestPlanInstance",param)
        if(res.code === 0){

            return res.data;
        }
    }


}


let testPlanInstanceStore = new TestPlanInstanceStore();
export default testPlanInstanceStore;