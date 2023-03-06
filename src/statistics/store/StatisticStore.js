/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 18:12:22
 */
import {Service} from "../../common/utils/requset";
import { observable, action } from "mobx";

export class StatisticsStore {
    // 事项统计
    @observable statisticsWorkList = [];

    // 人事统计
    @observable statisticsUserList = [];
    @observable UserXaixs = [];
    @observable UserYaixs = [];
    @observable UserPreData = [];
    @observable reportId = ""
    @observable reportList = [
        {
            title: '事项统计',
            icon: 'iconsmile',
            type: 'work',
            id: 'workall',
            children: []
        },
        {
            title: '事项创建与解决统计',
            icon: 'iconsmile',
            type: 'bulidend',
            id: 'bulidendall',
            children: []
        },
        {
            title: '事项新增趋势',
            icon: 'iconsmile',
            type: 'newtrend',
            id: 'newtrendall',
            children: []
        },
        {
            title: '日志统计',
            icon: 'iconsmile',
            type: 'logStatistics',
            id: 'logStatisticsAll',
            children: []
        }
    ]

    @action
    getStaticsUserList = async() => {
        const data = await Service("/workItemStat/statWorkItemByAssigner", value)
        if(data.code === 0){
            if (data.data.length !== 0) {
                this.UserXaixs = []
                this.UserYaixs = []
                this.UserPreData = []
                this.statisticsUserList = data.data;
                data.data.map((item, index) => {
                    this.UserXaixs.push(item.assigner.name)
                    this.UserYaixs.push(item.groupCount)
                    this.UserPreData.push({ name: item.assigner.name, value: item.percent })
                    return 0;
                })
            }
        }
        return data;
    }

    @action
    createReport = async (value) => {
        const data = await Service("/report/createReport", value)
        return data;
    }

    @action
    findReportList = async (value) => {
        const data = await Service("/report/findReportList", value)
        if (data.code === 0) {
            const list = data.data;
            this.setReportList([
                {
                    title: '事项统计',
                    icon: 'iconsmile',
                    reportType: 'work',
                    type: "work",
                    id: 'workall',
                    children: []
                },
                {
                    title: '事项创建与解决统计',
                    icon: 'iconsmile',
                    reportType: 'bulidend',
                    type: "work",
                    id: 'bulidendall',
                    children: []
                },
                {
                    title: '事项新增趋势',
                    icon: 'iconsmile',
                    reportType: 'newtrend',
                    type: "work",
                    id: 'newtrendall',
                    children: []
                },
                {
                    title: '事项完成趋势',
                    icon: 'iconsmile',
                    reportType: 'endtrend',
                    type: "work",
                    id: 'endtrendall',
                    children: []
                },
                {
                    title: '事项累计新建趋势',
                    icon: 'iconsmile',
                    reportType: 'newtotaltrend',
                    type: "work",
                    id: 'newtotaltrendall',
                    children: []
                },
                {
                    title: '事项累计完成趋势',
                    icon: 'iconsmile',
                    reportType: 'endtotaltrend',
                    type: "work",
                    id: 'endtotaltrendall',
                    children: []
                },
                {
                    title: '日志成员项目统计',
                    icon: 'iconsmile',
                    reportType: 'loguserwork',
                    type: "log",
                    id: 'loguserall',
                    children: []
                },
                {
                    title: '日志项目成员统计',
                    icon: 'iconsmile',
                    reportType: 'logprojectuser',
                    type: "log",
                    id: 'logprojectuserall',
                    children: []
                },
                {
                    title: '日志项目事项统计',
                    icon: 'iconsmile',
                    reportType: 'logprojectwork',
                    type: "log",
                    id: 'logprojectworkall',
                    children: []
                }
            ])
            this.reportList.map(routerItem => {
                list.map(item => {
                    if (item.reportType === routerItem.reportType) {
                        routerItem.children.push(item)
                    }
                })
            })

        }
        console.log(this.reportList)
        return data;
    }

    @action
    setReportList = (value) => {
        this.reportList = value
    }

    @action
    findReport = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/report/findReport", params)
        return data;
    }

    @action
    setReportId = (id) => {
        this.reportId = id;
    }

    @action
    statisticWorkItem = async (value) => {;
        const data = await Service("/statistic/statisticWorkItem", value)
        return data;
    }

    @action
    deleteReport = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/report/deleteReport", value)
        return data;
    }

    @action
    statisticBuildAndEndWorkItem = async (value) => {
        const data = await Service("/statistic/statisticBuildAndEndWorkItem", value)
        return data;
    }

    @action
    updateReport = async (value) => {
        const data = await Service("/report/updateReport", value)
        return data;
    }

    @action
    statisticsNewWorkItemCount = async (value) => {
        const data = await Service("/projectInsightReportController/statisticsNewWorkItemCount", value)
        return data;
    }

    @action
    statisticsEndWorkItemCount = async (value) => {
        const data = await Service("/projectInsightReportController/statisticsEndWorkItemCount", value)
        return data;
    }

    @action
    statisticsWorkItemTotalCountList = async (value) => {
        const data = await Service("/projectInsightReportController/statisticsWorkItemTotalCountList", value)
        return data;
    }

    @action
    statisticsEndWorkItemTotalCountList = async (value) => {
        const data = await Service("/projectInsightReportController/statisticsEndWorkItemTotalCountList", value)
        return data;
    }

    @action
    findDmUserPage = async (value) => {
        const params = {
            domainId: value.projectId,
            pageParam : { pageSize: 10, currentPage: 1 }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        return data;
    }


    @action
    findProjectList = async (values) => {
        const params = {
            orderParams: [{
                name: "projectName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            projectSetId: values.projectSetId
        }
        const data = await Service("/projectSet/findProjectList", params)
        this.projectRelevance = data.data
        return data;
    }

    
}

export const STATISTICS_STORE = "statisticsStore"

