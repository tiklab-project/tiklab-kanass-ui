/*
 * @Descripttion: 项目详情store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-31 13:26:38
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 13:08:23
 */
import { observable, action} from "mobx";

export class ProjectDetailStore {
    @observable projectId = "";
    @observable sprintId = "";
    @observable projectSetBreadcumbText = {}

    @action
    setProjectSetBreadcumbText = (value)=> {
        this.projectSetBreadcumbText = value;
    }

    @action
    setProjectId = (id)=> {
        this.projectId = id;
    }

    /**
     * 设置迭代id
     * @param {*} id 
     */
    @action
    setSprintId = (id)=> {
        this.sprintId = id;
    }

    
}

export const PROJECTDETAIL_STORE = "projectDetailStore"