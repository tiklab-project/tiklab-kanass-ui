/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-26 14:59:02
 */
import {GetStaticsWorkList,GetStaticsUserList} from "../api/statistics";
import { observable, action } from "mobx";

export class SprintStatisticStore {
    // 事项统计
    @observable statisticsWorkList = [];
    @observable workXaixs = [];
    @observable workYaixs = [];
    @observable workPreData = [];

    // 人事统计
    @observable statisticsUserList = [];
    @observable UserXaixs = [];
    @observable UserYaixs = [];
    @observable UserPreData = [];

    @action 
    getStaticsWorkList = (value) => {
        const params = new FormData();
        params.append("sprintId",value)
        return new Promise ((resolve,reiect)=> {
            GetStaticsWorkList(params).then(response => {
                if(this.statisticsWorkList.length !== 0){
                    // debugger
                    this.workXaixs = []
                    this.workYaixs = []
                    this.workPreData = []
                }
                this.statisticsWorkList = response.data;
                this.statisticsWorkList.map((item,index)=> {
                    // this.workXaixs.push(item.workStatus.name)
                    this.workYaixs.push(item.groupCount)
                    // this.workPreData.push({name: item.workStatus.name,value: item.groupCount})
                    return 0;
                })
                resolve()
            }).catch(error => {
                reiect(error)
            })
        })
		
    }

    @action 
    getStaticsUserList = () => {
        return new Promise ((resolve,reiect)=> {
            GetStaticsUserList().then(response => {
                if(this.statisticsUserList.length !== 0){
                    this.UserXaixs=[]
                    this.UserYaixs=[]
                    this.UserPreData=[]
                }
                this.statisticsUserList = response.data;
                this.statisticsUserList.map((item,index)=> {
                    this.UserXaixs.push(item.assigner.name)
                    this.UserYaixs.push(item.groupCount)
                    this.UserPreData.push({name: item.assigner.name,value: item.groupCount})
                    return 0;
                })
                resolve()
            }).catch(error => {
                reiect(error)
            })
        })
		
    }
}

export const SPRINTSTATISTICS_STORE = "sprintStatisticStore"

