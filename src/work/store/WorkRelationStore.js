import { observable, action } from "mobx";
import {WorkRelationList,SelectWorkRelationList,AddWorkRelation,
        DeleWorkRelation,SearchWorkRelation,SearchAllWorkRelation} from "../api/WorkRelationApi";


export class WorkRelation {
    @observable workRelationList = [];
    @observable selectWorkRelationList = [];
    @observable searchWorkRelationName = [];
    @observable unRelationTotal = 1;
    @observable searchCondition = {
        sortParams: [{
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
        const data = await WorkRelationList(this.searchCondition)
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
	getSelectWorkRelationList = (value) => {
        Object.assign(this.searchSelectCondition, {...value})
        const params={
            workItemId: this.searchSelectCondition.workItemId,
            title: this.searchSelectCondition.title,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchSelectCondition.currentPage
            }
        }
        return new Promise((resolve,reject)=>{
            SelectWorkRelationList(params).then(response => {
                if(response.code=== 0){
                    this.selectWorkRelationList = response.data;
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
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
            
        const data = await AddWorkRelation(params);
        return data;
    }

    //添加已选择人员
    @action
	deleWorkRelation = (value) => {

        const params = new FormData()
        params.append("id", value)
        
		DeleWorkRelation(params).then(response => {
            if(response.code=== 0){
                this.getSelectWorkRelationList()
            }
        }).catch(error => {
            console.log(error)
        })
    }



    //搜索已选择人员
    @action
	searchWorkRelation = (params) => {
        this.searchWorkRelationName = params
		SearchWorkRelation(params).then(response => {
            this.selectWorkRelationList = response.data.selectWorkRelationList;
        }).catch(error => {
            console.log(error)
        })
    }
    //搜索已未选择人员
    @action
	searchAllWorkRelation = (params) => {
		SearchAllWorkRelation(params).then(response => {
            this.workRelationList = response.data.workRelationList;
        }).catch(error => {
            console.log(error)
        })
    }
}
export const WORKRELATION_STORE = "workRelation"