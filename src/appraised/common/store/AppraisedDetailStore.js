import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class AppraisedDetailStore{
    @observable appraisedList = [];
    @observable appraised = "";
    @observable appraisedRouter = [];
    // const [router, setRouter] = useState();

    @action
    setAppraisedRouter = (value) => {
        this.appraisedRouter = value
    }

    @action
    findAppraisedList = async(value) => {
        const data = await Service("/appraised/findAppraisedList", value)
        if(data.code === 0){
            this.appraisedList = data.data
        }
        return data;
    }

    @action
    findAppraised = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/appraised/findAppraised", params)
        if(data.code === 0){
            this.appraised = data.data
        }
        return data;
    }
}
export default new AppraisedDetailStore();