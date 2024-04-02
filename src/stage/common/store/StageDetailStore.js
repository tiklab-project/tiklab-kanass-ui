import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class StageDetailStore {
    @observable stageList = [];
    @observable stage = "";
    @observable stageRouter = [];
    // const [router, setRouter] = useState();

    @action
    setStageRouter = (value) => {
        this.stageRouter = value
    }


    @action
    findStageList = async(value) => {
        const data = await Service("/stage/findStageList", value)
        if(data.code === 0){
            this.stageList = data.data
        }
        return data
    }

    @action
    findStage = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/stage/findStage", params)
        if(data.code === 0){
            this.stage = data.data
        }
        return data;
    }
    
}
export default new StageDetailStore()