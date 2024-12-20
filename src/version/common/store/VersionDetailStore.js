/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:06:48
 * @Description: 版本详情
 */

import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class VersionDetailStore {
    @observable versionList = [];
    @observable version = "";
    @observable versionRouter = [];
    // const [router, setRouter] = useState();

    @action
    setVersionRouter = (value) => {
        this.versionRouter = value
    }

    @action
    findVersionList = async(value) => {
        const data = await Service("/projectVersion/findVersionList", value)
        if(data.code === 0){
            this.versionList = data.data
        }
        return data;
    }

    @action
    findVersion = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/projectVersion/findVersion", params)
        if(data.code === 0){
            this.version = data.data
        }
        return data;
    }
    
}
export default new VersionDetailStore()