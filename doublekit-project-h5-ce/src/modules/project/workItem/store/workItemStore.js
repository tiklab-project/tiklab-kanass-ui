/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 17:01:47
 */
import { observable, action } from "mobx";
import { FindWorkItemList,FindAllWorkType,FindDmUserPage,FindAllWorkPriority,FindSprintList,
    FindModuleList, Upload,FindWorkAttachList,CreateWorkAttach } from "../api/work";

export class WorkItemStore {
    @observable workList = [];
    @observable total = [];
    @observable workTypeList = [];
    @observable projectUserList = [];
    @observable workPriorityList = [];
    @observable sprintList = [];
    @observable moduleList = []
    @observable searchCondition = {
        parentIdIsNull: true,
        orderParams: [{
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };

    @action
    getWorkConditionPage = async (value) => {
        this.setSearchCondition(value);
        this.searchCondition.parentIdIsNull = null
        let data = await FindWorkItemList(this.searchCondition);
        if(data.code === 0){
            this.workList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    setSearchCondition = (value) => {
        Object.assign(this.searchCondition, { ...value })
    }

    @action
    findAllWorkType = async() => {
        const data = await FindAllWorkType();
        if (data.code === 0) {
            const list = data.data;
            const workType = [];
            list && list.length > 0 && list.map(item => {
                workType.push({ value: item.id, label: item.name });
                return 0;
            })
            this.workTypeList = workType;
        }
        return data;
    }

    //获取已选择人员
    @action
    getProjectUserList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindDmUserPage(params)
        if(data.code === 0){
            const list = data.data.dataList;
            const userList = [];
            list && list.length > 0 && list.map(item => {
                userList.push({ value: item.user.id, label: item.user.name });
                return 0;
            })
            this.projectUserList = userList;
        } 
    }

    @action
    findAllWorkPriority = async() => {
        const data= await FindAllWorkPriority()
        if(data.code === 0){
            const list = data.data;
            const priorityList = [];
            list && list.length > 0 && list.map(item => {
                priorityList.push({ value: item.id, label: item.name });
                return 0;
            })
            this.workPriorityList = priorityList;
        } 
    }

    @action
    findSprintList = async(projectId) => {
        const params = {
            projectId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindSprintList(params)
        if(data.code === 0){
            const list = data.data;
            const sprint = [];
            list && list.length > 0 && list.map(item => {
                sprint.push({ value: item.id, label: item.sprintName });
                return 0;
            })
            this.sprintList = sprint;
        } 
    }

    @action
    findModuleList = async(projectId) => {
        const params = {
            projectId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindModuleList(params)
        if(data.code === 0){
            const list = data.data;
            const module = [];
            list && list.length > 0 && list.map(item => {
                module.push({ value: item.id, label: item.moduleName });
                return 0;
            })
            this.moduleList = module;
        } 
    }

    @action
    upload = async(file) => {
        const params = new FormData();
        params.append("uploadFile",file)
        const data = Upload(params);
        return data;
    }

    @action
    findWorkAttachList = async(value) => {
        const params = {
            workItemId: value,
        }
        const data = await FindWorkAttachList(params);
        return data;
    }

    @action
    createWorkAttach = (workId, fileName) => {
        const params = {
            workItem: {
                id: workId
            },
            attachment: {
                fileName: fileName
            }
        }
        const data = CreateWorkAttach(params);
        return data;
    }
}
export const WORKITEM_STORE = "workItemStore"