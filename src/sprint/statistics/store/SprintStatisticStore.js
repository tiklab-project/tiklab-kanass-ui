/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 18:12:22
 */
import {Service} from "../../../common/utils/requset";
import { observable, action } from "mobx";

export class SprintStatisticStore {
    @action
    statisticsSprintWorkItemTotalCountList = async (value) => {
        const data = await Service("/projectInsightReport/statisticsSprintWorkItemTotalCountList", value)
        return data;
    }

    @action
    statisticsSprintEndWorkItemTotalCountList = async (value) => {
        const data = await Service("/projectInsightReport/statisticsSprintEndWorkItemTotalCountList", value)
        return data;
    }
}

export const SPRINT_STATISTICS_STORE = "sprintstatisticStore"

