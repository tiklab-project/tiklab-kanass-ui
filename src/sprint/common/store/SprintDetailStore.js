/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 15:29:18
 * @Description: 迭代接口
 */
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class SprintDetailStore {
    @observable sprintList = [];
    @observable sprint = "";
    @observable sprintRouter = [];
    // const [router, setRouter] = useState();

    @action
    setSprintRouter = (value) => {
        this.sprintRouter = value
    }


    @action
    findSprintList = async(value) => {
        const data = await Service("/sprint/findSprintList", value)
        if(data.code === 0){
            this.sprintList = data.data
        }
        return data
    }

    @action
    findSprint = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/sprint/findSprint", params)
        if(data.code === 0){
            this.sprint = data.data
        }
        return data;
    }

    

    
}
export default new SprintDetailStore()