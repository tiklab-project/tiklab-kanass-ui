/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-26 18:12:22
 */
import { GetStaticsUserList, CreateReport, FindReportList, FindReport, 
    StatisticWorkItem,DeleteReport,StatisticBuildAndEndWorkItem,UpdateReport } from "../api/statistics";
import { observable, action } from "mobx";

export class StatisticStore {
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
            type: 'statisticWork',
            key: `/index/prodetail/statistics/work`,
            children: []
        },
        {
            title: '事项创建与解决统计',
            icon: 'iconsmile',
            type: 'bulidend',
            key: `/index/prodetail/statistics/bulidend`,
            children: []
        }
    ]

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
    findReportList = async (value) => {
        const data = await FindReportList(value);
        if (data.code === 0) {
            const list = data.data;
            this.setReportList([
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
                }
            ])
            this.reportList.map(routerItem => {
                list.map(item => {
                    if(item.reportType === routerItem.type){
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
    statisticWorkItem = async(value) => {
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
    statisticBuildAndEndWorkItem = async(value) => {
        // const params = new FormData();
        // params.append("dateRanger", value.dateRanger);
        // params.append("cellTime", value.cellTime)
        // params.append("collectionType", value.collectionType)
        const data = await StatisticBuildAndEndWorkItem(value);
        return data;
    }

    @action
    updateReport = async(value) => {
        const data = await UpdateReport(value);
        return data;
    }
}

export const STATISTICS_STORE = "staisticStore"

