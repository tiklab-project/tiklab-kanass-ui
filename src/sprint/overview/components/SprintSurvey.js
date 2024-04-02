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
import { Row, Col, Progress, Empty, Tooltip } from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";
import moment from 'moment';
import SprintSurveyStore from "../store/SprintSurveyStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoListBox from "../../../common/overviewComponent/TodoListBox";
import SprintEndState from "./SprintEndState";
import SprintStartState from "./SprintStartState";
const SprintSurvey = (props) => {
    const { findSprint, findSprintBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList, findWorkItemNumByQuickSearch } = SprintSurveyStore;

    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    const [sprintInfo, setSprintInfo] = useState()
    const masterId = getUser().userId;
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
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
        findSprint({ sprintId: sprintId }).then(res => {
            setSprintInfo(res.data)
            const sprint = res.data;
            // 燃尽图
            findSprintBurnDowmChartPage(sprintId).then(res => {
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

        findWorkItemNumByQuickSearch(data).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data?.ending / res.data?.all;
            setPercent(percent * 100 ? percent.toFixed(2) * 100 : 0)
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


    /**
         * 点击跳转到工作列表
         * @param {tab key} index 
         */
    const goWorkItemList = (value) => {
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`)
    }
    const goDynamicList = () => {
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/dynamic`)

    }
    const goToListPage = () => {
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTodo`)
    }



    const stateButton = (state) => {
        let dom = null;

        if (state === "000000" && sprintInfo?.workNumber > 0) {
            dom = <div className="sprint-state-start-button" onClick={() => changeStateToStart()}>
                开始迭代
            </div>
        }

        if (state === "000000" && sprintInfo?.workNumber <= 0) {
            dom = <Tooltip placement="bottom" title={"当前迭代没有规划事项，不能开始"}>
                <div className="sprint-state-disable-button">
                    开始迭代
                </div>
            </Tooltip>


        }

        if (state === "111111" && sprintInfo?.workNumber > 0) {
            dom = <div className="sprint-state-start-button" onClick={() => changeStateToEnd()}>
                完成迭代
            </div>
        }
        return dom;
    }
    const [startStateVisable, setStartStateVisable] = useState(false)
    const [endStateVisable, setEndStateVisable] = useState(false)
    const changeStateToStart = () => {
        setStartStateVisable(true)
    }

    const changeStateToEnd = () => {
        setEndStateVisable(true)
    }

    return (
        <Row style={{ height: "100%", background: "var(--thoughtware-gray-600)", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="sprint-survey">
                    <div className="sprint-survey-top">
                        <div className="sprint-info-box">
                            <div className="sprint-info-top">
                                <div className="sprint-info-title">
                                    <img
                                        src={('/images/project1.png')}
                                        alt=""
                                        className="list-img"
                                    />
                                    {sprintInfo && sprintInfo.sprintName}
                                </div>
                                {
                                    stateButton(sprintInfo?.sprintState.id)
                                }
                            </div>

                            <div className="sprint-container">
                                <div className="sprint-item">
                                    <UserIcon userInfo={sprintInfo?.master} size="big" className="item-icon" name={sprintInfo?.master.nickname} />
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.master?.nickname}</div>
                                        <div className="item-bottom">迭代负责人</div>
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
                                        <div className="item-top">{sprintInfo?.startTime.slice(0, 10)} ~ {sprintInfo?.endTime.slice(0, 10)}</div>
                                        <div className="item-bottom">迭代计划周期</div>
                                    </div>
                                </div>

                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.relaStartTime ? sprintInfo?.relaStartTime.slice(0, 10) : "未开始"}  ~ {sprintInfo?.relaEndTime ? sprintInfo?.relaEndTime.slice(0, 10) : "未结束"}</div>
                                        <div className="item-bottom">迭代实际周期</div>
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

                    <TodoListBox todoTaskList={todoTaskList} goToListPage={goToListPage} model={"sprint"} />

                    <DynamicList logList={opLogList} goDynamicList={goDynamicList} goOpLogDetail={goOpLogDetail} />
                </div>
                <SprintStartState
                    visible={startStateVisable}
                    projectId={projectId}
                    sprintId={sprintId}
                    SprintSurveyStore={SprintSurveyStore}
                    setVisible={setStartStateVisable}
                    sprintInfo={sprintInfo}
                    setSprintInfo={setSprintInfo}
                />
                <SprintEndState
                    visible={endStateVisable}
                    projectId={projectId}
                    sprintId={sprintId}
                    SprintSurveyStore={SprintSurveyStore}
                    setVisible={setEndStateVisable}
                    sprintInfo={sprintInfo}
                    setSprintInfo={setSprintInfo}
                />
            </Col>
        </Row>

    )
}

export default observer(SprintSurvey);