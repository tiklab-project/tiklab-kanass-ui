/*
 * @Descripttion: 路线图store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 09:28:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-30 14:26:11
 */
import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset"
export class LineMapStore {
    @observable sprintRoadList = [];
    @observable versionRoadList = [];
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
        if(data.code === 0){
            this.sprintRoadList = data.data;
        }
        return data;
    }

    @action
	updateSprint = async(value) => {

        const data = await Service("/sprint/updateSprint", value)
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
        if(data.code === 0){
            this.versionRoadList = data.data;
        }
        return data;
    }

    @action
	updateVersion = async(value) => {
        const data = await Service("/projectVersion/updateVersion", value)
        return data;
    }

    
    // 获取迭代路线图

    @action
	updateEpic = async(value) => {
        const data = await Service("/epic/updateEpic", value)
        return data;
    }

    /**
     * 创建最近点击的
     * @param {最近点击的} value 
     * @returns 
     */
    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;
       
    }

    @action
    updateSprint = async(values) => {
        const data = await Service("/sprint/updateSprint", values)
        return data;
    }

    @action
    updateVersion = async (value) => {
        const data = await Service("/projectVersion/updateVersion", value);
        return data;
    }
}

export default new LineMapStore();