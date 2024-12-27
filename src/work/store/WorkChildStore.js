/*
 * @Descripttion: 事项子事项接口
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:07:50
 * @LastEditTime: 2024-12-27 10:20:49
 */
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
            name: "code",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @observable searchSelectCondition = {
        orderParams: [{
            name: "code",
            orderType:"desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    
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

    // 获取事项层级
    @action
    findChildrenLevel = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findChildrenLevel", params)
        return data;
    }

    // 设置事项层级
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
    
    // 添加子事项
    @action
	addWorkChild = async(value) => {
        let params = {
            id: value.id,
            updateField: "parentWorkItem",
            parentWorkItem: {
                id: value.parentWorkId || "nullstring"
            },
            stage: {
                id: value.stage
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

    //删除事项
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

    // 根据code获取事项类型
    @action
	findWorkTypeListByCode = async() => {
        const params  = new FormData();
        params.append("code", "demand")
        const data = await Service("/workType/findWorkTypeListByCode", params)
        return data;
    }
}
export default new WorkChildStore();