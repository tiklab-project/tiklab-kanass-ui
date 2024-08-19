import { action, observable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SettingHomeStore {
    @observable
    selectKey = ""
    
    @action
    setSelectKey = (key) => {
        this.selectKey = key;
    }
    @action
    findOrgaNum = async () => {
        const data = await Service("/setting/findOrgaNum");
        return data;
    }
}

export default new SettingHomeStore();