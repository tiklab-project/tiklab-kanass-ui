
import {observable,action} from "mobx";
import {Axios} from "tiklab-core-ui";


class FuncUnitStepStore {
    @observable funcUnitStepList = [];
    @observable funcUnitStepInfo = {};



    @action
    findFuncUnitStepList = async (id) => {

        const params = {
            funcUnitId: id,
            orderParams:[{name:'sort', orderType:'asc'}],
        }
        const res = await Axios.post("/funcUnitStep/findFuncUnitStepList",params)
        if(res.code === 0) {
            this.funcUnitStepList=res.data;
            return res.data
        }
    }


    @action
    findFuncUnitStep =async (id) => {
        const param = new FormData();
        param.append('id', id);

        let res =  await Axios.post("/funcUnitStep/findFuncUnitStep",param)
        if(res.code === 0){
            this.funcUnitStepInfo = res.data;
            return res.data;
        }
    }

    @action
    createFuncUnitStep =async (values) => await Axios.post("/funcUnitStep/createFuncUnitStep",values)


    @action
    updateFuncUnitStep = async (values) => await Axios.post("/funcUnitStep/updateFuncUnitStep",values)


    @action
    deleteFuncUnitStep = async (id) => {
        const param = new FormData();
        param.append('id', id)

        return await Axios.post("/funcUnitStep/deleteFuncUnitStep",param)
    }

}

let funcUnitStepStore = new FuncUnitStepStore();
export default funcUnitStepStore;
