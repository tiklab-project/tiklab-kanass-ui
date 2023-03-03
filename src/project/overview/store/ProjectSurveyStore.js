/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 17:05:45
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-02 09:58:09
 */
import { observable, action } from "mobx";
import { StatWorkItemByBusStatus,StatProjectManageSprint,FindProject,
    FindDynamicPage,FindProjectBurnDowmChartPage, FindMilestoneList, 
    StatProjectWorkItemProcess,Findlogpage, Findtodopage } from "../api/SurveyApi";
export class ProjectSurveyStore {

    @action
	statWorkItemByBusStatus = async(projectId, masterId) => {
        const params = new FormData();
        params.append("projectId",projectId)
        if(masterId){
           params.append("masterId",masterId) 
        }
        
		const data = await StatWorkItemByBusStatus(params);
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
                pageSize: 4,
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
    findMilestoneList = async(projectId)=> {
        const params = {
            projectId: projectId
        }
        const data = await FindMilestoneList(params);
        return data;
    }

    @action
	statProjectWorkItemProcess = async(value) => {
        const params = new FormData();
        params.append("projectId",value)
		const data = await StatProjectWorkItemProcess(params);
        return data;
    }

    @action
    findtodopage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 20,
                currentPage: value.currentPage
            },
            bgroup: "teamwire",
            userId: value.userId,
            content: {
                projectId: value.projectId
            }
        }
        const data = await Findtodopage(params);
        return data;
    }


    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 20,
                currentPage: value.currentPage
            },
            bgroup: "teamwire",
            content: {
                projectId: value.projectId
            }

        }
        const data = await Findlogpage(params);
        return data;
    }
}
export const PROJECTSURVEY_STORE = "projectSurveyStore"