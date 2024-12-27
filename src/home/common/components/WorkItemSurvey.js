/*
 * @Descripttion: 事项概况统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:54:38
 */
import React, { useEffect, } from 'react';
import "./WorkItemSurvey.scss";
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import HomeStore from '../store/HomeStore';
import WorkStore from '../../../work/store/WorkStore';
import { setWorkDeatilInList } from '../../../work/components/WorkSearch';
import echarts from "../../../common/echarts/echarts"

const WorkItemSurvey = (props) => {
    const { statisticsWorkItemByStatus } = HomeStore;
    const { setSearchCondition, findStateNodeList, setQuickFilterValue } = WorkStore;

    useEffect(() => {
        initWorkChart()
        return;
    }, [])

    // 初始化数据
    const initWorkChart = () => {
        const chartDom = document.getElementById(`statistics-workitem-chart`)
        statisticsWorkItemByStatus().then(res => {
            if (res.code === 0) {
                let myChart = echarts.init(chartDom);
                const data = res.data;
                const xData = [];
                const yData = [];
                xData.push("未完成");
                yData.push(
                    {
                        value: data.remain,
                        itemStyle: {
                            color: '#5470C6'
                        }
                    },
                );


                xData.push("进行中")
                yData.push({
                    value: data.progress,
                    itemStyle: {
                        color: '#91CC75'
                    }
                });

                xData.push("未开始")
                yData.push({
                    value: data.todo,
                    itemStyle: {
                        color: '#FAC858'
                    }
                });

                xData.push("逾期")
                yData.push({
                    value: data.overdue,
                    itemStyle: {
                        color: '#EE6666'
                    }
                })

                const option = {
                    xAxis: {
                        type: 'category',
                        data: xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: yData,
                            type: 'bar'
                        }
                    ]
                };

                myChart.setOption(option);
                myChart.on('click', function (params) {
                    // 控制台打印数据的名称
                    console.log(params);
                    selectMenu(params.dataIndex)
                });
            }
        })
    }   

    // 获取状态节点列表
    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        const newStateNodeList = stateNodeList.filter((item, index) => {
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
        });

        return newStateNodeList;
    }

    const selectMenu = (dataIndex) => {
        switch (dataIndex) {
            case 0:
                getPendingWorkItem();
                break;
            case 1:
                getProgressWorkItem();
                break;
            case 2:
                getTodoWorkItem();
                break;
            case 3:
                getOverdueWorkItem();
                break;
            default:
                break;
        }

    }


    const getPendingWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "pending",
            label: "我的待办"
        })
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getTodoWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "all",
            label: "全部"
        })
        getStateNodeList({ quickName: "todo" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getProgressWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "all",
            label: "全部"
        })
        getStateNodeList({ quickName: "progress" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            overdue: true,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "overdue",
            label: "已逾期"
        })
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    const getWorkList = (initValues) => {
        setWorkDeatilInList(WorkStore, initValues)
        sessionStorage.setItem("menuKey", "work")
        props.history.push("/workitem")

    }

    return (
        <div className="statistics-workitem">
            <div className="statistics-workitem-title">
                事项概况
            </div>
            <div id="statistics-workitem-chart" className="statistics-workitem-chart"></div>
        </div>
    )
}
export default withRouter(inject("homeStore")(observer(WorkItemSurvey)));