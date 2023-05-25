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

    @action
    findSystemUrl = async (value) => {
        const data = await Service("/systemUrl/findSystemUrl", value);
        return data;
    }

    @action
    updateSystemUrl = async (value) => {
        const data = await Service("/systemUrl/updateSystemUrl", value);
        return data;
    }

    @action
    deleteSystemUrl = async (value) => {
        const data = await Service("/systemUrl/deleteSystemUrl", value);
        return data;
    }
}

export const URLDATA_STORE = "urlDataStore"