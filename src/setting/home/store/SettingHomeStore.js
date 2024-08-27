import { action, observable } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SettingHomeStore {
    @observable
    selectKey = "/setting/version";

    @observable
    expandedTree = []
    
    @action
    setExpandedTree = (value) => {
        this.expandedTree = value;
    }

    @action
    setSelectKey = (key) => {
        this.selectKey = key;
    }
    
    @action
    findOrgaNum = async () => {
        const data = await Service("/setting/findOrgaNum");
        return data;
    }

    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            orderParams: [{
                name: "create_time",
                orderType:"desc"
            }],
            data: {
                sprintId: value.sprintId
            },
            bgroup: "kanass"
        }
        const data = await Service("/oplog/findlogpage", params)
        if(data.code === 0) {
            this.opLogList = data.data.dataList
        }
        return data;
    }
}

export default new SettingHomeStore();