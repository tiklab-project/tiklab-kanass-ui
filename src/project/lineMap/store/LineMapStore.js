/*
 * @Descripttion: 路线图store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 09:28:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:17:56
 */
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset"
export class LineMapStore {
    @observable sprintRoadList = [];

    /**
     * 获取迭代路线图
     * @param {项目id} projectId 
     * @returns 
     */
    @action
	findSprintRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
        const data = await Service("/roadMap/findSprintRoadMap", param)
        return data;
    }

    /**
     * 获取版本路线图
     * @param {项目id} projectId 
     * @returns 
     */
    @action
	findVersionRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
        const data = await Service("/roadMap/findVersionRoadMap", param)
        return data;
    }

    // 获取迭代路线图
    /**
     * 获取史诗路线图
     * @param {项目id} projectId 
     * @returns 
     */
    @action
	findEpicRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
        const data = await Service("/roadMap/findEpicRoadMap", param)
        return data;
    }
}

export const LINEMAP_STORE = "lineMapStore"