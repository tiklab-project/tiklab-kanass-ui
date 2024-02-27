import { observable, action } from "mobx";
import {Service} from "../../common/utils/requset";
class WorkChildStore {
    @observable workChildList = [];
    @observable selectWorkChildList = [];
    @observable searchWorkChildName = [];
    @observable childWorkList = []
    @observable selectChildToTal = 0;
    @observable childWorkItemTotal = 0;
    @observable searchCondition = {
        orderParams: [{
            name: "id",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @observable searchSelectCondition = {
        orderParams: [{
            name: "id",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    

    // @action
    // setChildWorkItem = (value) => {
    //     this.childWorkItem = value
    // }
    // 获取史诗下可添加的事项
    @action
    findEpicSelectWorkItemList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const data = await Service("/workItem/findEpicSelectWorkItemList", this.searchCondition)
        if(data.code === 0){
            if(this.searchCondition.pageParam.currentPage === 1){
                this.selectWorkChildList = data.data.dataList;
            }
            if(this.searchCondition.pageParam.currentPage > 1){
                this.selectWorkChildList = this.selectWorkChildList.concat(data.data.dataList);
            }
            this.selectChildToTal = data.data.totalPage;
        }
        return data;
    }

     // 获取其他事项类型下可添加的事项
    @action
    findSelectWorkItemList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const data = await Service("/workItem/findSelectChildrenWorkItemList", this.searchCondition)
        if(data.code === 0){
            if(this.searchCondition.pageParam.currentPage === 1){
                this.selectWorkChildList = data.data.dataList;
            }
            if(this.searchCondition.pageParam.currentPage > 1){
                this.selectWorkChildList = this.selectWorkChildList.concat(data.data.dataList);
            }
            this.selectChildToTal = data.data.totalPage;
        }
        return data;
    }

    @action
    findChildrenLevel = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findChildrenLevel", params)
        return data;
    }

    @action 
    setWorkChildList = (value) => {
        this.workChildList = value;
    }

    //获取已选择子事项
    @action
	getWorkChildList = async(value) => {
        Object.assign(this.searchSelectCondition, {...value});
        const data = await Service("/workItem/findWorkItemList", this.searchSelectCondition)
        return data;
    }
    //添加已选择事项
    @action
	addWorkChild = async(value) => {
        let params = {
            id: value.id,
            updateField: "parentWorkItem",
            parentWorkItem: {
                id: value.parentWorkId || "nullstring"
            },
            sprint: {
                id: value.sprintId
            },
            builder: {
                id: value.builder
            },
            assigner: {
                id: value.assigner
            },
            project: {
                id: value.projectId
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        return data;
    }

    //添加已选择事项
    @action
	deleWorkChild = async(value) => {
        let params = {
            id: value.id,
            updateField: "parentWorkItem",
            parentWorkItem: {
                id: "nullstring"
            }
        }
        const data = await Service("/workItem/updateWorkItem", params)
        if(data.code === 0){
            this.getWorkChildList()
        }
        return data;
    }

    @action
	findWorkTypeListByCode = async() => {
        const params  = new FormData();
        params.append("code", "demand")
        const data = await Service("/workType/findWorkTypeListByCode", params)
        return data;
    }
}
export default new WorkChildStore();