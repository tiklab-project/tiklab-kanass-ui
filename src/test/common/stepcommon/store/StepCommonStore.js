import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

/**
 * 公共步骤 store
 */
export class StepCommonStore {

    @observable stepList = [];


    @action
    findStepCommonList = async (value) => {
        const res = await Axios.post("/stepCommon/findStepCommonList",value);

        if(res.code === 0) {
            this.stepList = res.data;
            return res.data
        }
    }

    @action
    findStepCommon = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/stepCommon/findStepCommon",param);
        if( res.code === 0){
            return res.data;
        }
    }

    @action
    createStepCommon = async (values) =>  await Axios.post("/stepCommon/createStepCommon",values)

    @action
    updateStepCommon = async (values) => await Axios.post("/stepCommon/updateStepCommon",values)

    @action
    deleteStepCommon = async (id,type) => {
        const param = new FormData();
        param.append('id', id);
        param.append("caseType",type)

         await Axios.post("/stepCommon/deleteStepCommon",param)
    }

}

const stepCommonStore = new StepCommonStore();
export default stepCommonStore;
