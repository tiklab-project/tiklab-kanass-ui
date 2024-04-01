import { action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SettingHomeStore {
    @action
    findOrgaNum = async () => {
        const data = await Service("/setting/findOrgaNum");
        return data;
    }
}

export default new SettingHomeStore();