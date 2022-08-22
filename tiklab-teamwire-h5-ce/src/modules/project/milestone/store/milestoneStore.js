/*
 * @Descripttion: 
 * @milestone: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:20:36
 */
import { observable, action } from "mobx";
import { FindMilestoneList, CreateMilestone,FindDmUserPage, UpdateMilestone, FindMilestone } from "../api/milestone";

export class MilestoneStore {

    @action
    findMilestoneList = async (value) => {
        let data = await FindMilestoneList(value);
        return data;
    }

    @action
    createMilestone = async (value) => {
        let data = await CreateMilestone(value);
        return data;
    }

    @action
    getUseList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await FindDmUserPage(params);
        return data;
    }

    @action
    updateMilestone = async (value) => {
        let data = await UpdateMilestone(value);
        return data;
    }

    @action
    findMilestone = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        let data = await FindMilestone(params);
        return data;
    }
}
export const MILESTONE_STORE = "milestoneStore"