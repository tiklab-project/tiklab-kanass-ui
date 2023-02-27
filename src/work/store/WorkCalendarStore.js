/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-08 10:29:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:11:51
 */
import { observable, action } from "mobx";
import { GetMonthCalendar,GetMonthCalendarDay,GetMonthCalendarWeek } from "../api/WorkCalendarApi";

export class WorkCalendarStore {
    @observable workCalendarListPre = [];
    @observable workCalendarListCur = [];
    @observable workCalendarListNext = [];
    @observable workCalendarDayList = [];
    @observable workCalendarWeekList = [];

    @action
    getMonthCalendar = (month) => {
        // debugger
        return new Promise((resolve,reject)=> {
            GetMonthCalendar().then(response => {
                console.log(response)
                // return
                this.workCalendarListPre = response.data[month - 1];
                this.workCalendarListCur = response.data[month]
                this.workCalendarListNext = response.data[month + 1];
                resolve(response.data) 
                
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    @action
    getMonthCalendarDay = (month) => {
        // debugger
        return new Promise((resolve,reject)=> {
            GetMonthCalendarDay().then(response => {
                console.log(response)
                this.workCalendarDayList = response.data.dayData;
                resolve(response.data.dayData) 
                
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    @action
    getMonthCalendarWeek = () => {
        return new Promise((resolve,reject)=> {
            GetMonthCalendarWeek().then(response => {
                console.log(response)
                this.workCalendarWeekList = response.data.weekData;
                resolve(response.data.weekData) 
                
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }
}

export const WORKCALENDA_STORE = "workCalendarStore"