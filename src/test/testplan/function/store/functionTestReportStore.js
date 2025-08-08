import {observable,action} from "mobx";
import {Axios} from "tiklab-core-ui";


export class FunctionTestReportStore {
    @observable testPlanList = [];
    @observable testPlanInfo = {};
    @observable totalPage ;
    @observable testDrawerVisible=false;
    @observable TestPlanTestType;

    @action
    getFunctionTestReport = async (testPlanId) => {

        let params =new FormData()
        params.append("testPlanId",testPlanId)

        const res = await Axios.post("/functionTestReport/getFunctionTestReport",params)
        if(res.code === 0) {
            return res.data
        }
    }


}

let functionTestReportStore = new FunctionTestReportStore()
export default functionTestReportStore;
