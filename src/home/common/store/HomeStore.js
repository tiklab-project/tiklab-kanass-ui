/*
 * @Descripttion: 首页store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-22 14:04:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-30 14:23:05
 */
import { Service } from "../../../common/utils/requset"
import { observable, action, extendObservable } from "mobx";

import { getUser } from 'tiklab-core-ui';

class HomeStore {
    // 项目列表
    @observable
    ProjectList = [];
    // 消息总条数
    @observable
    messageTotal = 0;
    // 消息列表
    @observable
    messageList = [];
    // 消息列表是否到最后一页
    @observable
    isMessageReachBottom = true;
    // 动态总数
    @observable
    dynamicTotal = 0;
    // 动态列表
    @observable
    dynamicList = [];
    // 日志列表
    @observable
    logList = [];


    @observable opLogTotal = 0;
    @observable opLogCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }
    // 待办列表
    @observable
    todoTaskList = [];

    @observable
    endTaskList = [];

    @observable
    overdueTaskList = [];
    // 当天被激活的tab
    @observable
    activeKey = "overview";

    @observable
    todoActiveKey = 1;
    // 待办的条件分页
    @observable todoTotal = 0;
    @observable todoCondition = {
        pageParam: {
            pageSize: 10,
            currentPage: 1,
            totalPage: 1
        },
        orderParams: [{
            name: "createtime",
            orderType: "desc"
        }],
        bgroup: "kanass",
        data: {}
    }

    // 是否是动态最后一页
    @observable isDynamicReachBottom = true;

    @observable recentList = [];

    @observable insightList = [];
    @observable insightSearch = {
        orderParams: [{
            name: "createdTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @action
    setTodoTaskList = (value) => {
        this.todoTaskList = value
    }

    @action
    setOpLogList = (value) => {
        this.logList = value
    }

    @action
    findInsightList = async (value) => {
        Object.assign(this.insightSearch, { ...value })
        const data = await Service("/insight/findInsightList", this.insightSearch)
        if (data.code === 0) {
            this.insightList = data.data;
        }
        return data;
    }

    // 设置被激活tab
    @action
    setActiveKey = (value) => {
        this.activeKey = value
    }

    @action
    setTodoActiveKey = (value) => {
        this.todoActiveKey = value
    }

    /**
     * 获取当前登陆者最近点击的项目
     * @param {登录者id} value 
     * @returns 
     */
    @action
    findProjectSortRecentTime = async (value) => {
        const data = await Service("/project/findProjectSortRecentTime", value)
        return data;
    }

    /**
     * 获取事项的业务状态统计列表，(进行中，已完成，逾期)
     * @returns 
     */
    @action
    statWorkItemByBusStatus = async () => {
        const data = await Service("/workItemStat/statWorkItemByBusStatus")
        return data;
    }

    /**
     * 获取我管理的项目下的迭代
     * @param {项目id} value 
     * @returns 
     */
    @action
    manageSprint = async (value) => {
        const params = new FormData();
        params.append("projectId", value)
        const data = await Service("/workItemStat/statManageSprint", params)
        return data;
    }

    /**
     * 统计待办事项
     * @param {每页条数} value 
     * @returns 
     */
    @action
    statTodoWorkItem = async (value) => {
        const params = {
            bgroup: "kanass",
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
     * 创建最近点击的
     * @param {最近点击的} value 
     * @returns 
     */
    @action
    findRecentPage = async (masterId) => {
        const params = {
            masterId: masterId,
            model: "workItem",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/recent/findRecentListToModel", params)
        if (data.code === 0) {
            this.recentList = data.data;
        }
        return data;
    }

    // 更新点击时间
    @action
    updateRecent = async (value) => {
        const data = await Service("/recent/updateRecent", value)
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
            pageParam: {
                pageSize: 10,
                currentPage: value.page
            },
            sendType: 'site',
            receiver: getUser().userId,
            status: value.status,
            bgroup: "kanass"
        }

        const data = await Service("/message/messageItem/findMessageItemPage", params)
        if (data.code === 0) {
            this.messageTotal = data.data.totalPage;
            if (value.page === 1) {
                this.messageList = data.data.dataList
            }
            if (value.page > 1 && this.isMessageReachBottom) {
                this.messageList.push(...data.data.dataList);
            }


            if (value.page >= this.messageTotal) {
                this.isMessageReachBottom = false
            } else {
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
        value.bgroup = "kanass"
        const data = await Service("/message/messageItem/updateMessageItem", value)
        return data;
    }



    @action
    setTodoCondition = (value) => {
        this.todoCondition = extendObservable(this.todoCondition, { ...value })
    }

    @action
    setOpLogCondition = (value) => {
        this.opLogCondition = extendObservable(this.opLogCondition, { ...value })
    }





    /**
     *成员id, 项目id
     * @param {待办} value 
     * @returns 
     */
    @action
    findTodopage = async (value, type) => {
        this.todoTaskList = [];
        this.setTodoCondition(value)

        const data = await Service("/todo/findtodopage", this.todoCondition);
        if (data.code === 0) {
            const list = data.data.dataList;
            if (type !== "projectSet") {
                this.todoTaskList = list;
                this.todoCondition.pageParam.totalPage = data.data.totalPage;
            }

        }
        return data;
    }

    /**
* 获取系统操作日志列表
* @param {成员id, 项目id} value 
* @returns 
*/
    @action
    findLogpage = async (value) => {
        this.setOpLogCondition(value)
        const data = await Service("/oplog/findlogpage", this.opLogCondition);
        if (data.code === 0) {
            const dataList = data.data.dataList;
            this.opLogCondition.pageParam.totalPage = data.data.totalPage;
            this.opLogCondition.pageParam.total = data.data.totalRecord;
            this.logList = []
            if (dataList.length > 0) {
                dataList.map(item => {
                    const date = item.createTime.slice(0, 10);
                    const list1 = this.logList.filter(dateItem => dateItem.date === date)
                    if (list1.length > 0) {
                        this.logList.map(dateItem => {
                            if (dateItem.date === date) {
                                dateItem.children.push(item)
                            }
                            return dateItem;
                        })
                    } else {
                        this.logList.push({
                            date: date,
                            children: [item]
                        })
                    }
                })
            }
            console.log(this.logList)
        }
        return data;
    }

    @action
    findLogPageByTime = async (value) => {
        Object.assign(this.opLogCondition, value)
        const data = await Service("/oplog/findLogPageByTime", this.opLogCondition);
        if (data.code === 0) {
            this.logList = data.data.dataList;
        }
    }

    @action
    findProjectSetLogpage = async (value) => {
        const project = await Service("/projectSet/findProjectList", value);
        if (project.code === 0) {
            const list = project.data;

            const getAllLogList = async (list, value) => {
                let dataList = [];
                for (let i = 0; i < list.length; i++) {
                    const params = { ...value, data: { ...this.opLogCondition.data, projectId: list[i].id } };
                    this.setOpLogCondition(params);

                    try {
                        const data = await Service("/oplog/findLogPageByTime", this.opLogCondition);
                        if (data.code === 0 && data.data.dataList.length > 0) {
                            if(dataList.length === 0){
                                dataList.push(...data.data.dataList);
                            }else {
                                data.data.dataList.forEach(item => {
                                    const existingDateItem = dataList.find(dateItem => dateItem.time === item.time);
                                    if(existingDateItem){
                                        existingDateItem.loggingList.push(...item.loggingList);
                                        existingDateItem.loggingList.sort((a, b) => a.createTime - b.createTime);
                                    }
                                    
                                })
                               
                            }
                        }
                        dataList.sort((a, b) => a.time - b.time);
                    } catch (error) {
                        console.error(`Error fetching logs for project ${list[i].id}:`, error);
                    }
                }
                return dataList;
            };

            const dataList = await getAllLogList(list, value);
            this.logList = dataList;

           
        }
        console.log(this.logList)
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

    @action
    findInsightList = async () => {
        const params = {
            orderParams: [{
                name: "insightName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/insight/findInsightList", params)
        return data;
    }

    @action
    statisticsDayAllWorkItemCount = async () => {
        const data = await Service("/projectInsightReport/statisticsDayAllWorkItemCount")
        return data;
    }

 

    @action
    statisticsProjectByStatus = async () => {
        const data = await Service("/projectInsightReport/statisticsProjectByStatus")
        return data;
    }

    @action
    statisticsWorkItemByStatus = async () => {
        const data = await Service("/projectInsightReport/statisticsWorkItemByStatus")
        return data;
    }

    @action
    statisticsTodoWorkByStatus = async (params) => {
        const data = await Service("/projectInsightReport/statisticsTodoWorkByStatus", params)
        return data;
    }
}


export default new HomeStore();