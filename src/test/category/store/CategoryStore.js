import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

/**
 * 模块
 */
export class CategoryStore{
    @observable categoryList = [];
    @observable categoryTableList=[]
    @observable categoryIds = [];

    /**
     * 查询模块树
     * 包含用例
     */
    @action
    findCategoryListTree = async (params) => {
        const data = {
            // orderParams:[{ name:'name',  orderType:'desc' }],
            ...params
        }

        const res = await Axios.post("/module/findCaseModuleListTree",data)
        if(res.code === 0) {
           this.categoryList = res.data;
           return res.data;
        }
    }

    @action
    findCategoryListTreeTable = async (params) => {
        const data = {
            // orderParams:[{ name:'name',  orderType:'desc' }],
            ...params
        }

        const res = await Axios.post("/module/findModuleListTree",data)
        if(res.code === 0) {
            this.categoryTableList = res.data;
            return res.data;
        }
    }



    @action
    setCategoryIds = (ids) => {
        this.categoryIds = ids;
    }

}

const categoryStore =  new CategoryStore();
export default categoryStore;
