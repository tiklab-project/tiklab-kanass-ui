/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 18:12:22
 */
import {
    GetStaticsUserList, CreateReport, FindReportList, FindReport,
    StatisticWorkItem, DeleteReport, StatisticBuildAndEndWorkItem, UpdateReport,
    StatisticsNewWorkItemCount, StatisticsEndWorkItemCount,StatisticsWorkItemTotalCountList,
    StatisticsEndWorkItemTotalCountList, FindDmUserPage, FindProjectList
} from "../api/StatisticsApi";

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
    // @action
    // getStaticsWorkList = () => {
    //     return new Promise((resolve, reiect) => {
    //         GetStaticsWorkList().then(response => {
    //             if (response.data.length > 0) {
    //                 // debugger
    //                 this.workXaixs = []
    //                 this.workYaixs = []
    //                 this.workPreData = []
    //                 this.statisticsWorkList = response.data;
    //                 response.data.map((item) => {
    //                     this.workXaixs.push(item.workStatus.name)
    //                     this.workYaixs.push(item.groupCount)
    //                     this.workPreData.push({ name: item.workStatus.name, value: item.percent })
    //                     return 0;
    //                 })
    //             } else {
    //                 this.statisticsWorkList = [];
    //             }
    //             resolve()
    //         }).catch(error => {
    //             reiect(error)
    //         })
    //     })

    // }

    @action
    getStaticsUserList = () => {
        return new Promise((resolve, reiect) => {
            GetStaticsUserList().then(response => {
                if (response.data.length !== 0) {
                    this.UserXaixs = []
                    this.UserYaixs = []
                    this.UserPreData = []
                    this.statisticsUserList = response.data;
                    response.data.map((item, index) => {
                        this.UserXaixs.push(item.assigner.name)
                        this.UserYaixs.push(item.groupCount)
                        this.UserPreData.push({ name: item.assigner.name, value: item.percent })
                        return 0;
                    })
                }

                resolve()
            }).catch(error => {
                reiect(error)
            })
        })

    }

    @action
    createReport = async (value) => {
        const data = await CreateReport(value);
        return data;
    }

    @action
    findReportList = async (value, projectType) => {
        const data = await FindReportList(value);
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
        const data = await FindReport(params);
        return data;
    }

    @action
    setReportId = (id) => {
        this.reportId = id;
    }

    @action
    statisticWorkItem = async (value) => {
        const data = await StatisticWorkItem(value);
        return data;
    }

    @action
    deleteReport = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await DeleteReport(params);
        return data;
    }

    @action
    statisticBuildAndEndWorkItem = async (value) => {
        const data = await StatisticBuildAndEndWorkItem(value);
        return data;
    }

    @action
    updateReport = async (value) => {
        const data = await UpdateReport(value);
        return data;
    }

    @action
    statisticsNewWorkItemCount = async (value) => {
        const data = await StatisticsNewWorkItemCount(value);
        return data;
    }

    @action
    statisticsEndWorkItemCount = async (value) => {
        const data = await StatisticsEndWorkItemCount(value);
        return data;
    }

    @action
    statisticsWorkItemTotalCountList = async (value) => {
        const data = await StatisticsWorkItemTotalCountList(value);
        return data;
    }

    @action
    statisticsEndWorkItemTotalCountList = async (value) => {
        const data = await StatisticsEndWorkItemTotalCountList(value);
        return data;
    }

    @action
    findDmUserPage = async (value) => {
        const params = {
            domainId: value.projectId,
            pageParam : { pageSize: 10, currentPage: 1 }
        }
        const data = await FindDmUserPage(params);
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
        const data = await FindProjectList(params);
        
        this.projectRelevance = data.data
        return data;
    }

    
}

export const STATISTICS_STORE = "statisticsStore"

