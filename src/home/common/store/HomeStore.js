/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:21:47
 */
import {Service} from "../../../common/utils/requset"
import { observable, action, extendObservable } from "mobx";

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

    /**
     * 获取当前登陆者最近点击的项目
     * @param {登录者id} value 
     * @returns 
     */
    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("recentMasterId",value)
        const data = await Service("/workItemStat/statProjectWorkItem", params)
        return data;
    }

    /**
     * 获取事项的业务状态统计列表，(进行中，已完成，逾期)
     * @returns 
     */
    @action
	statWorkItemByBusStatus = async() => {
        const data = await Service("/workItemStat/statWorkItemByBusStatus")
        return data;
    }
    
    /**
     * 获取我管理的项目下的迭代
     * @param {项目id} value 
     * @returns 
     */
    @action
	manageSprint = async(value) => {
        const params = new FormData();
        params.append("projectId",value)
        const data = await Service("/workItemStat/statManageSprint", params)
        return data;
    }

    /**
     * 统计待办事项
     * @param {每页条数} value 
     * @returns 
     */
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
        const data = await Service("/todo/findtodopage", params)
        return data;
    }

    /**
     * 获取动态列表
     * @param {当前页数} value 
     * @returns 
     */
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
        const data = await Service("/dynamic/findDynamicPage", params)
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
    
    /**
     * 获取消息列表 
     * @param {页数，状态（已读，未读）} value 
     * @returns 
     */
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
        
        const data = await Service("/message/messageItem/findMessageItemPage", params)
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

    /**
     * 更新信息状态
     * @param {信息id，状态} value 
     * @returns 
     */
    @action
    updateMessageDispatchItem = async (value) => {
        const data = await Service("/message/messageItem/updateMessageItem", value)
        return data;
    }

    /**
     * 获取系统操作日志列表
     * @param {成员id, 项目id} value 
     * @returns 
     */
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
            }
        }
        
        const data = await Service("/oplog/findlogpage", params);
        if(data.code === 0) {
            this.opLogList = data.data.dataList
        }
        return data;
    }

    @action
    setTodoCondition = (value) => {
        this.todoCondition = extendObservable(this.todoCondition,  { ...value })
    }

    /**
     *成员id, 项目id
     * @param {待办} value 
     * @returns 
     */
    @action
    findTodopage = async(value)=> {
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
        const data = await Service("/todo/findtodopage", params);
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
        return data;
    }

    /**
     * 获取全部项目列表
     * @returns 
     */
    @action
    findProjectList = async () => {
        const data = await Service("/project/findAllProject");
        return data;
    }
    
    /**
     * 获取迭代列表
     * @param {*} value 
     * @returns 
     */
    @action
    findSprintList = async (value) => {
        const data = await Service("/sprint/findSprintList", value);
        return data;
    }

    /**
     * 获取项目集列表
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectSetList = async (value) => {
        const data = await Service("/projectSet/findProjectSetList", value);
        return data;
    }

    /**
     * 项目集下项目列表
     * @param {} value 
     * @returns 
     */
    @action
    findProjectSetProjectList = async (value) => {
        const data = await Service("/projectSet/findProjectList", value);
        return data;
    }
    
    

}

export const HOME_STORE = "homeStore"