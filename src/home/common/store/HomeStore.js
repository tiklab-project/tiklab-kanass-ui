/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:21:47
 */
import { observable, action, extendObservable } from "mobx";
import { StatProjectWorkItem,StatWorkItemByBusStatus,
    ManageSprint,GetWorkType,CreateRecent, FindWorkStatusListBySorts,
    StatTodoWorkItem,FindMessageDispatchItemPage, FindDynamicPage, 
    FindRecentList, UpdateMessageDispatchItem, Findlogpage, Findtodopage, 
    FindAllProject, FindSprintList, FindProjectSetList, FindProjectSetProjectList } from "../api/HomeApi";

import { getUser } from 'tiklab-core-ui';

export class HomeStore {
    @observable ProjectList = [];
    @observable currentLink = "home";
    @observable messageTotal = 0;
    @observable messageList = [];
    @observable isMessageReachBottom = true;

    @observable dynamicTotal = 0;
    @observable dynamicList = [];
    @observable opLogList = [];
    @observable todoTaskList = [];
    @observable activeKey = "survey";

    @observable todoCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1
        },
        bgroup: "teamwire",
        content: {}
    }
    
    
    @observable isDynamicReachBottom = true;

    @action
    setActiveKey = (value) => {
        this.activeKey = value
    }
    @action
    setCurrentLink = (value) => {
        this.currentLink = value
    }

    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("recentMasterId",value)
		const data = await StatProjectWorkItem(params);
        return data;
    }

    @action
	statWorkItemByBusStatus = async() => {
        // const params = new FormData();
        // params.append("projectId",value)
		const data = await StatWorkItemByBusStatus();
        return data;
    }

    @action
	manageSprint = async(value) => {
        const params = new FormData();
        params.append("projectId",value)
		const data = await ManageSprint(params);
        return data;
    }

    //获取事项类型
    @action
    workType= async() => {
        const data = await GetWorkType();
        return data;
    }

    @action
    findWorkStatusListBySorts= async(value) => {
        const data = await FindWorkStatusListBySorts(value);
        return data;
    }

    @action
	statTodoWorkItem = async(value) => {
        const params={
            bgroup : "teamwire",
            status: 1,
            pageParam: {
                pageSize: value.pageSize,
                currentPage: 1
            },
        }
		const data = await StatTodoWorkItem(params);
        return data;
    }

    // @action
    // findMessageDispatchItemPage = async(value) => {
    //     const params = {
    //         receiver: value.receiver,
    //         sendType: value.sendType,
    //         pageParam: {
    //             pageSize: 7,
    //             currentPage:1
    //         }
    //     }
	// 	const data = await FindMessageDispatchItemPage(params);
    //     return data;
    // }

    @action
    findDynamicPage = async(value)=> {
        const params={
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 20,
                currentPage: value.currentPage
            }
        }
        const data = await FindDynamicPage(params);
        if(data.code === 0) {
            if(value.currentPage === 1){
                this.dynamicList = data.data.dataList
            }
            if(value.currentPage > 1) {
                this.dynamicList.push(...data.data.dataList);
            }

            this.dynamicTotal = data.data.totalPage;
            if(value.currentPage >= this.dynamicTotal) {
                this.isDynamicReachBottom = false
            }else {
                this.isDynamicReachBottom = true
            }

        }
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await CreateRecent(value)
        return data;

    }

    @action
    findRecentList = async (value) => {
        const data = await FindRecentList(value)
        return data;

    }

    @action
    findMessageDispatchItemPage = async (value) => {
        const params = {
            pageParam:{
                pageSize:10,
                currentPage: value.page
            },
            sendType: 'site',
            receiver: getUser().userId,
            status: value.status,
            bgroup: "teamwire"
        }
        const data = await FindMessageDispatchItemPage(params)
        if(data.code === 0){
            this.messageTotal = data.data.totalPage;
            if(value.page === 1){
                this.messageList = data.data.dataList
            }
            if(value.page > 1 && this.isMessageReachBottom) {
                this.messageList.push(...data.data.dataList);
            }

           
            if(value.page >= this.messageTotal) {
                this.isMessageReachBottom = false
            }else {
                this.isMessageReachBottom = true
            }
        }
        return data;
    }

    @action
    updateMessageDispatchItem = async (value) => {
        const data = await UpdateMessageDispatchItem(value)
        return data;
    }

    @action
    findLogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            bgroup: "teamwire",
            userId: value.userId,
            content: {
                projectId: value.projectId
                // project: {
                //     id: value.projectId,
                // }
            }
        }
        const data = await Findlogpage(params);
        if(data.code === 0) {
            this.opLogList = data.data.dataList
        }
        return data;
    }

    @action
    setTodoCondition = (value) => {
        this.todoCondition = extendObservable(this.todoCondition,  { ...value })
    }

    @action
    findTodopage = async(value)=> {
        // extendObservable(this.todoCondition.content, {...contentValue});
        const params={
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            bgroup: "teamwire",
            userId: value.userId,
            content: {
                projectId: value.projectId
            }
        }
        this.setTodoCondition(value)
        const data = await Findtodopage(params);
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
        return data;
    }

    @action
    findProjectList = async () => {
        const data = await FindAllProject()
        return data;
    }
    

    @action
    findSprintList = async (value) => {
        const data = await FindSprintList(value)
        return data;
    }

    @action
    findProjectSetList = async (value) => {
        const data = await FindProjectSetList(value)
        return data;
    }

    @action
    findProjectSetProjectList = async (value) => {
        const data = await FindProjectSetProjectList(value)
        return data;
    }
    
    

}

export const HOME_STORE = "homeStore"