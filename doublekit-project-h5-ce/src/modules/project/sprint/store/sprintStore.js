/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:20:36
 */
import { observable, action } from "mobx";
import { FindSprintPage } from "../api/sprint";

export class SprintStore {
    @observable workList = [];
    @observable total = [];
    
    @observable searchCondition = {
        parentIdIsNull: true,
        orderParams: [{
            name: "sprintName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };

    @action
    getSprintConditionPage = async (value) => {
        this.setSearchCondition(value);
        // this.searchCondition.parentIdIsNull = null
        let data = await FindSprintPage(this.searchCondition);
        // if(data.code === 0){
        //     this.workList = data.data.dataList;
        //     this.total = data.data.totalRecord;
        // }
        return data;
    }

    @action
    setSearchCondition = (value) => {
        Object.assign(this.searchCondition, { ...value })
    }
}
export const SPRINT_STORE = "sprintStore"