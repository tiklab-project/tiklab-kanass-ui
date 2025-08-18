import {action, observable} from "mobx";
import {Service} from "../../../../common/utils/requset";

export class ProductPlanDetailStore{
    @observable productPlanList = [];
    @observable productPlan = "";
    @observable productPlanRouter = [];
    // const [router, setRouter] = useState();

    @action
    setProductPlanRouter = (value) => {
        this.productPlanRouter = value
    }


    @action
    findProductPlanList = async(value) => {
        const data = await Service("/productPlan/findProductPlanList", value)
        if(data.code === 0){
            this.productPlanList = data.data
        }
        return data
    }

    @action
    findProductPlan = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/productPlan/findProductPlan", params)
        if(data.code === 0){
            this.productPlan = data.data
        }
        return data;
    }




}
export default new ProductPlanDetailStore();