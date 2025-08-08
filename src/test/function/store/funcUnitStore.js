import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";


export class FuncUnitStore {

    @observable funcUnitList = [];
    @observable funcUnitInfo;
    @observable testCaseInfo;

    @action
    findFuncUnitList = async (value) => {

        const res = await Axios.post("/funcUnitCase/findFuncUnitCaseListByTestCase",value);

        if(res.code === 0) {
            this.funcUnitList = res.data;
            return res.data
        }
    }

    @action
    findFuncUnit = async (id) => {
        const param = new FormData();
        param.append('id', id);

        const res = await Axios.post("/funcUnitCase/findFuncUnitCase",param);
        if( res.code === 0){
            this.funcUnitInfo = res.data;
            this.testCaseInfo =res.data.testCase
            return  res.data;
        }
    }


    @action
    createFuncUnit = async (values) => await Axios.post("/funcUnitCase/createFuncUnitCase",values)

    @action
    updateFuncUnit = async (values) => await Axios.post("/funcUnitCase/updateFuncUnitCase",values)

    @action
    deleteFuncUnit = async (id) => {
        const param = new FormData();
        param.append('id', id);

        await Axios.post("/funcUnitCase/deleteFuncUnitCase",param)
    }

}

export default new FuncUnitStore();
