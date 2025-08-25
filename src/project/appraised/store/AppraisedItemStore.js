import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class AppraisedItemStore {

    @observable
    record="";

    @observable
    appraisedItemList = [];
    @observable
    total = 0;
    @observable
    recordId= "";

    @action
    setRecordId = (value) => {
        this.recordId = value;
    }

    @action
    getRecordId = () => {
        return this.recordId;
    }

    @action
    createAppraisedItem = async (value) => {
        const data = await Service("/appraisedItem/createAppraisedItem", value)
        return data;
    }

    @action
    findAppraisedItemById = async (id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/appraisedItem/findAppraisedItem", param)
        if (data.code === 0){
            this.record = data.data;
        }
        return data;
    }

    @observable
    searchCondition = {
        orderParams: [{
            name: "ai.createTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @action
    searchAppraisedWorkItemPage = async (params) => {
        Object.assign(this.searchCondition, { ...params })
        const data = await Service("/appraisedItem/findAppraisedItemPage", this.searchCondition)
        if (data.code === 0) {
            this.appraisedItemList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    updateAppraisedWorkItem = async (value) => {
        const params = {
            id: value.id,
            appraisedItemState: value.appraisedItemState,
            advice: value.advice
         }
        const data = await Service("/appraisedItem/updateAppraisedItem", params)
        return data;
    }

    @action
    deleteAppraisedWorkItem = async (id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/appraisedItem/deleteAppraisedItem", params)
        return data;
    }














    @observable
    canConnectItemList = [];
    @observable
    total = 0;
    @observable
    canConnectSearchCondition = {
        orderParams: [{
            name: "buildTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 5,
            currentPage: 1
        }
    };

    @action
    searchCanConnectWorkItem = async (params) => {
        Object.assign(this.canConnectSearchCondition, { ...params })
        const data = await Service("/appraisedItem/findCanConnectWorkItemPage", this.canConnectSearchCondition)
        if (data.code === 0) {
            this.canConnectItemList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    searchCanConnectDocument = async (params) => {
        Object.assign(this.canConnectSearchCondition, { ...params })
        const data = await Service("/appraisedItem/findCanConnectDocumentPage", this.canConnectSearchCondition)
        if (data.code === 0) {
            this.canConnectItemList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    searchCanConnectTestCase = async (params) => {
        Object.assign(this.canConnectSearchCondition, { ...params })
        const data = await Service("/appraisedItem/findCanConnectTestCasePage", this.canConnectSearchCondition)
        if (data.code === 0) {
            this.canConnectItemList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }
}
export default new AppraisedItemStore();