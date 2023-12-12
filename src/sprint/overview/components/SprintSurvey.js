/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 15:47:40
 */
import React, { useEffect, useState } from "react";
import "../components/sprintSurvey.scss";
import { Row, Col, Progress, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";
import moment from 'moment';
import SprintSurveyStore from "../store/SprintSurveyStore";
import WorkStore from "../../../work/store/WorkStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoListBox from "../../../common/overviewComponent/TodoListBox";
const SprintSurvey = (props) => {
    const { FindSprint, FindSprintBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList, statWorkItemByBusStatus } = SprintSurveyStore;
    const { setSearchType } = WorkStore;

    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    const [sprintInfo, setSprintInfo] = useState()
    const masterId = getUser().userId;
    // 进度
    const [percent, setPercent] = useState()
    // 事项状态列表
    const [workStatusList, setWorkStatusList] = useState();
    useEffect(() => {
        const data = {
            masterId: masterId,
            sprintId: sprintId,
            projectId: projectId
        }
        FindSprint({ sprintId: sprintId }).then(res => {
            setSprintInfo(res.data)
            const sprint = res.data;
            FindSprintBurnDowmChartPage(sprintId).then(res => {
                if (res.code === 0) {
                    let timerXaixs = [];
                    let workCountYaixs = [];
                    let Yaxis = [];
                    if (res.data.dataList.length > 0) {
                        res.data.dataList.map((item, index) => {
                            timerXaixs.push(item.recordTime);
                            workCountYaixs.push(item.remainWorkitemCount);
                            Yaxis.push(item.totalWorkitemCount * (7 - index) / 7);
                            return;
                        })
                    } else {
                        timerXaixs.push(moment().format("YYYY-MM-DD"));
                        Yaxis.push(sprint.workNumber);
                        workCountYaixs.push(sprint.workNumber);
                        let i = 1;
                        for (i = 1; i <= 6; i++) {
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(sprint.workNumber);
                            Yaxis.push(sprint.workNumber * (7 - i) / 7);
                        }
                    }
                    burnDownChart(timerXaixs, workCountYaixs, Yaxis)
                }
            })
        })
        // 燃尽图

        statWorkItemByBusStatus(data).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data?.ending / res.data?.all;
            setPercent(percent ? percent.toFixed(2) : 0)
        })
        findlogpage({ userId: masterId, sprintId: sprintId })

        findtodopage({ userId: masterId, sprintId: sprintId, status: 1, pageSize: 10 })

        return;
    }, [sprintId])

    /**
     * 燃尽图
     */
    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('sprint-burn-down'));
        let option;
        option = {
            color: ['#5470c6', '#91cc75'],
            xAxis: {
                type: 'category',
                data: timerXaixs
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                data: ['real', 'ideal']
            },
            series: [
                {
                    data: workCountYaixs,
                    name: 'real',
                    // stack: 'Total',
                    type: 'line'
                },
                {
                    name: 'ideal',
                    type: 'line',
                    // stack: 'Total',
                    data: Yaxis
                },
            ]
        };
        burnDown.setOption(option)
    }

    const goOpLogDetail = (url) => {
        window.location.href = url
    }
    const goTodoDetail = (url) => {
        window.location.href = url
    }

    /**
         * 点击跳转到工作列表
         * @param {tab key} index 
         */
    const goWorkItemList = (value) => {
        setSearchType(value)
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`)
    }
    const goDynamicList = () => {
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/dynamic`)
        
    }
    const goToListPage = () => {
        props.history.push(`/projectScrumDetail/:id/sprintdetail/${sprintId}/workTodo`) 
    }

    return (
        <Row style={{ height: "100%", background: "var(--thoughtware-gray-600)", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="sprint-survey">
                    <div className="sprint-survey-top">
                        <div className="sprint-info-box">
                            <div className="sprint-info-title">
                                <img
                                    src={('/images/project1.png')}
                                    alt=""
                                    className="list-img"
                                />
                                {sprintInfo && sprintInfo.sprintName}
                            </div>
                            <div className="sprint-container">
                                <div className="sprint-item">
                                    <UserIcon userInfo={sprintInfo?.master} size="big" className="item-icon" name={sprintInfo?.master.nickname} />
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="sprint-work">
                                    <div className="sprint-item" onClick={() => goWorkItemList("all")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.all}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item" onClick={() => goWorkItemList("pending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.pending}</div>
                                            <div className="item-bottom">待办</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item" onClick={() => goWorkItemList("ending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.ending}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item" onClick={() => goWorkItemList("overdue")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.overdue}</div>
                                            <div className="item-bottom">已逾期</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.sprintState.name}</div>
                                        <div className="item-bottom">迭代状态</div>
                                    </div>
                                </div>

                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.startTime} ~ {sprintInfo?.endTime}</div>
                                        <div className="item-bottom">迭代周期状态</div>
                                    </div>
                                </div>

                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top item-progress"><Progress percent={percent} status="active" /></div>
                                        <div className="item-bottom">迭代进度</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="burn-down-box">
                            <div className="sprint-title">迭代燃尽图</div>
                            <div className="burn-down" id="sprint-burn-down">

                            </div>
                        </div>
                    </div>
                    {/* <div className="sprint-todo">
                        <div className="sprint-title">
                            <span className="name">待办事项</span>
                            {
                                todoTaskList.length > 10 && <div className="more" onClick={() => { props.history.push(`/projectScrumDetail/:id/sprintdetail/${sprintId}/workTodo`) }}>
                                    <svg aria-hidden="true" className="svg-icon">
                                        <use xlinkHref="#icon-rightjump"></use>
                                    </svg>
                                </div>
                            }

                        </div>
                        <div className="sprint-todo-list">
                            {
                                todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                    return <div
                                        dangerouslySetInnerHTML={{ __html: item.data }}
                                        className="todo-item"
                                        key={item.id}
                                        onClick={() => goTodoDetail(item.link)}
                                    />
                                })
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
                            }
                        </div>
                    </div> */}
                    <TodoListBox todoTaskList = {todoTaskList} goToListPage = {goToListPage} model = {"sprint"}/>
                  
                    <DynamicList logList = {opLogList} goDynamicList = {goDynamicList} goOpLogDetail = {goOpLogDetail} />
                </div>
            </Col>
        </Row>

    )
}

export default observer(SprintSurvey);