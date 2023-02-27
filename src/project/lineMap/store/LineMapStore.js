/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 09:28:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:17:56
 */
import {FindSprintRoadMap,FindVersionRoadMap,FindEpicRoadMap } from "../api/lineMap";
import { observable, action } from "mobx";
export class LineMapStore {
    @observable sprintRoadList = [];

    @action
	findSprintRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
		const data = await FindSprintRoadMap(param);
        return data;
    }

    // 获取迭代路线图
    @action
	findVersionRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
		const data = await FindVersionRoadMap(param);
        return data;
    }

    // 获取迭代路线图
    @action
	findEpicRoadMap = async(projectId) => {
        const param = new FormData()
        param.append("projectId", projectId)
		const data = await FindEpicRoadMap(param);
        return data;
    }
}

export const LINEMAP_STORE = "lineMapStore"