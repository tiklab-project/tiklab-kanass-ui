import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class AppraisedHistoryStore {

    @observable
    record="";

    @observable
    appraisedHistoryList = [];
    @observable
    totalPage = 0;
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

    // @action
    // cleanAppraisedHistoryList = () => {
    //     this.appraisedHistoryList = [];
    // }

    @action
    createAppraisedHistory = async (value) => {
        const data = await Service("/appraisedHistory/createAppraisedHistory", value)
        return data;
    }

    @action
    findAppraisedHistoryById = async (id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/appraisedHistory/findAppraisedHistory", param)
        if (data.code === 0){
            this.record = data.data;
        }
        return data;
    }

    @observable
    searchCondition = {
        orderParams: [{
            name: "createTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 5,
            currentPage: 1
        }
    };

    @action
    searchAppraisedHistoryPage = async (params) => {
        Object.assign(this.searchCondition, { ...params })
        const data = await Service("/appraisedHistory/findAppraisedHistoryPage", this.searchCondition)
        if (data.code === 0) {
            if(this.searchCondition.pageParam.currentPage === 1){
                this.appraisedHistoryList = data.data.dataList;
            }
            if(this.searchCondition.pageParam.currentPage > 1){
                this.appraisedHistoryList = this.appraisedHistoryList.concat(data.data.dataList);
            }
            this.totalPage = data.data.totalPage;
        }
        return data;
    }

    @action
    findAppraisedHistoryList = async (params) => {
        Object.assign(this.searchCondition, { ...params })
        const data = await Service("/appraisedHistory/findAppraisedHistoryList", this.searchCondition)
        if (data.code === 0) {
            this.appraisedHistoryList = data.data;
        }
        return data;
    }

    @action
    updateAppraisedHistory = async (value) => {
        const params = {
            id: value.id,
            workItemAppraisedState: value.workItemAppraisedState,
            advice: value.advice
         }
        const data = await Service("/appraisedHistory/updateAppraisedHistory", params)
        return data;
    }

    @action
    deleteAppraisedHistory = async (id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/appraisedHistory/deleteAppraisedHistory", params)
        return data;
    }


}
export default new AppraisedHistoryStore();