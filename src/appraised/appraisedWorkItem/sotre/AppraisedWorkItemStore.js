import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class AppraisedWorkItemStore {

    @observable
    record="";

    @observable
    appraisedWorkItemList = [];
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
    createAppraisedWorkItem = async (value) => {
        const data = await Service("/appraisedWorkItem/createAppraisedWorkItem", value)
        return data;
    }

    @action
    findAppraisedWorkItemById = async (id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/appraisedWorkItem/findAppraisedWorkItem", param)
        if (data.code === 0){
            this.record = data.data;
        }
        return data;
    }

    @observable
    searchCondition = {
        orderParams: [{
            name: "buildTime",
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
        const data = await Service("/appraisedWorkItem/findAppraisedWorkItemPage", this.searchCondition)
        if (data.code === 0) {
            this.appraisedWorkItemList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    updateAppraisedWorkItem = async (value) => {
        const params = {
            id: value.id,
            workItemAppraisedState: value.workItemAppraisedState,
            advice: value.advice
         }
        const data = await Service("/appraisedWorkItem/updateAppraisedWorkItem", params)
        return data;
    }

    @action
    deleteAppraisedWorkItem = async (id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/appraisedWorkItem/deleteAppraisedWorkItem", params)
        return data;
    }














    @observable
    canConnectWorkItemList = [];
    @observable
    workItemTotal = 0;
    @observable
    workItemSearchCondition = {
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
        Object.assign(this.workItemSearchCondition, { ...params })
        const data = await Service("/appraisedWorkItem/findCanConnectWorkItemPage", this.workItemSearchCondition)
        if (data.code === 0) {
            this.canConnectWorkItemList = data.data.dataList;
            this.workItemTotal = data.data.totalRecord;
        }
        return data;
    }
}
export default new AppraisedWorkItemStore();