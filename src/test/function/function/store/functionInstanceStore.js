import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";


export class FunctionInstanceStore {
    /**
     * 设置功能用例的结果
     * @param values
     * @returns {Promise<unknown>}
     */
    @action
    createFunctionInstance =async (values) => await Axios.post("/functionInstance/createFunctionInstance",values)



    /**
     * 设置功能用例的结果
     * @param values
     * @returns {Promise<unknown>}
     */
    @action
    setFunctionResult =async (values) => await Axios.post("/functionInstance/setFunctionResult",values)


    /**
     * 设置功能用例下步骤的结果
     * @param values
     * @returns {Promise<unknown>}
     */
    @action
    setFunctionStepResult =async (values) => await Axios.post("/functionStepInstance/setFunctionStepResult",values)


    @action
    findFunctionInstancePage = async (values) => {
        const params = {
            ...values,
        }

        let res = await Axios.post("/functionInstance/findFunctionInstancePage", values)
        if (res.code === 0) {
            return res.data;
        }
    }

    @action
    findRecentCaseFunctionInstanceList = async (value) => {
        const res = await Axios.post("/functionInstance/findRecentCaseFunctionInstanceList",value);
        if(res.code === 0) {
            return res.data
        }
    }

}

let functionInstanceStore = new FunctionInstanceStore();
export default functionInstanceStore;
