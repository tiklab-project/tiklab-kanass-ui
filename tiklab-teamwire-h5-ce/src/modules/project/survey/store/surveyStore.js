/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:38:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 17:38:05
 */
import { observable, action } from "mobx";
import { StatProjectWorkItemByBusStatus,StatProjectManageSprint,FindProject,
    FindDynamicPage,FindProjectBurnDowmChartPage,UpdateproList } from "../api/surveyApi";
export class ProjectSurveyStore {

    @action
	statProjectWorkItemByBusStatus = async(projectId) => {
        const params = new FormData();
        params.append("projectId",projectId)
		const data = await StatProjectWorkItemByBusStatus(params);
        return data;
    }

    @action
	statProjectManageSprint = async(value) => {
        const params = new FormData();
        params.append("masterId",value.masterId)
        params.append("projectId",value.projectId)
		const data = await StatProjectManageSprint(params);
        return data;
    }
    @action
    findProject = async(projectId)=> {
        const params = new FormData();
        params.append("id",projectId);
        const data = await FindProject(params);
        return data;
    }
    
    @action
    findDynamicPage = async(projectId)=> {
        const params={
            projectId: projectId,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await FindDynamicPage(params);
        return data;
    }

    // 燃尽图
    @action
    findProjectBurnDowmChartPage = async(projectId)=> {
        const params={
            projectId: projectId,
            sortParams: [{
                name: "recordTime",
                orderType:"desc"
            }],
            pageParam: {
                pageSize: 7,
                currentPage: 1
            }
        }
        const data = await FindProjectBurnDowmChartPage(params);
        return data;
    }


    @action
    updateProject = (values) => {
        const data = UpdateproList(values);
        return data;
    }

}
export const PROJECTSURVEY_STORE = "projectSurveyStore"
