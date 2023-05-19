import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class UrlDataStore {

    @action
    findAllSystemUrl = async () => {
        const data = await Service("/systemUrl/findAllSystemUrl");
        return data;
    }

    @action
    createSystemUrl = async (value) => {
        const data = await Service("/systemUrl/createSystemUrl", value);
        return data;
    }
}

export const URLDATA_STORE = "urlDataStore"