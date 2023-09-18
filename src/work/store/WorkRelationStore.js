import { observable, action } from "mobx";
import {Service} from "../../common/utils/requset";

class WorkRelationStore {
    @observable workRelationList = [];
    @observable selectWorkRelationList = [];
    @observable searchWorkRelationName = [];
    @observable unRelationTotal = 1;
    @observable searchCondition = {
        orderParams: [{
            name: "createTime",
            orderType:"asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };
    @observable searchSelectCondition = {
        currentPage: 1
    };

    // 获取所有成员
    @action
	getWorkRelationList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const data = await Service("/workItem/findWorkItemPage", this.searchCondition)
        if(data.code=== 0){
            if(this.searchCondition.pageParam.currentPage === 1){
                this.workRelationList = data.data.dataList;
            }
            if(this.searchCondition.pageParam.currentPage > 1){
                this.workRelationList = this.workRelationList.concat(data.data.dataList);
            }
            this.unRelationTotal = data.data.totalPage;
        }
        return data;
    }

    //获取已选择人员
    @action
	getSelectWorkRelationList = async(value) => {
        Object.assign(this.searchSelectCondition, {...value})
        const params={
            workItemId: this.searchSelectCondition.workItemId,
            title: this.searchSelectCondition.title,
            orderParams: [{
                name: "id",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchSelectCondition.currentPage
            }
        }
        const data = await Service("/workRelate/findWorkRelateList", params)
        if(data.code=== 0){
            this.selectWorkRelationList = data.data;
        }
        return data.data;
    }


    //添加已选择人员
    @action
	addWorkRelation = async(value) => {
        let params = {
            relateWorkItem: {
                id: value.id
            },
            workItem: {
                id: value.workItem
            }
        }
        const data = await Service("/workRelate/createWorkRelate", params)
        return data;
    }

    //添加已选择人员
    @action
	deleWorkRelation = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workRelate/deleteWorkRelate", params)
		if(data.code=== 0){
            this.getSelectWorkRelationList()
        }
        return data;
    }

}
export default new WorkRelationStore();