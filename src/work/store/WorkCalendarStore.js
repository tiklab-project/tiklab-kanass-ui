/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-08 10:29:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 10:11:51
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";

export class WorkCalendarStore {
    @observable workCalendarListPre = [];
    @observable workCalendarListCur = [];
    @observable workCalendarListNext = [];
    @observable workCalendarDayList = [];
    @observable workCalendarWeekList = [];

    @action
    getMonthCalendar = async (month) => {
        const data = await Service("/calendar", this.searchCondition)
        if (data.code === 0) {
            this.workCalendarListPre = data.data[month - 1];
            this.workCalendarListCur = data.data[month]
            this.workCalendarListNext = data.data[month + 1];
        }
        return data;
    }

    @action
    getMonthCalendarDay = async(month) => {
        const data = await Service("/calendarDay", this.searchCondition)
        return data;
    }

    @action
    getMonthCalendarWeek = async() => {
        const data = await Service("/calendarWeek", this.searchCondition)
        if(data.data === 0){
            this.workCalendarWeekList = data.data.weekData;
        }
        return data;
    }
}

export default new WorkCalendarStore();