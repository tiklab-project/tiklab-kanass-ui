/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 15:47:40
 */
import React, { useEffect, useState } from "react";
import "../components/stageSurvey.scss";
import { Row, Col, Progress, Empty, Tooltip } from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";
import moment from 'moment';
import StageSurveyStore from "../store/StageSurveyStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoListBox from "../../../common/overviewComponent/TodoListBox";
import StageEndState from "./StageEndState";
import StageStartState from "./StageStartState";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
const StageSurvey = (props) => {
    const { findStage, findStageBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList, findWorkItemNumByQuickSearch } = StageSurveyStore;

    const stageId = props.match.params.stage;
    const projectId = props.match.params.id;
    const [stageInfo, setStageInfo] = useState()
    const masterId = getUser().userId;
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    // 进度
    const [percent, setPercent] = useState()
    // 事项状态列表
    const [workStatusList, setWorkStatusList] = useState();
    useEffect(() => {
        const data = {
            masterId: masterId,
            stageId: stageId,
            projectId: projectId
        }
        findStage({ stageId: stageId }).then(res => {
            setStageInfo(res.data)
            const stage = res.data;
            // 燃尽图
            findStageBurnDowmChartPage(stageId).then(res => {
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
                        Yaxis.push(stage.workNumber);
                        workCountYaixs.push(stage.workNumber);
                        let i = 1;
                        for (i = 1; i <= 6; i++) {
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(stage.workNumber);
                            Yaxis.push(stage.workNumber * (7 - i) / 7);
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
        findlogpage({ userId: masterId, stageId: stageId })

        findtodopage({ userId: masterId, stageId: stageId, status: 1, pageSize: 10 })

        return;
    }, [stageId])

    /**
     * 燃尽图
     */
    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('stage-burn-down'));
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
        props.history.push(`/${projectId}/stagedetail/${stageId}/workitem`)
    }
    const goDynamicList = () => {
        props.history.push(`/${projectId}/stagedetail/${stageId}/dynamic`)

    }
    const goToListPage = () => {
        props.history.push(`/${projectId}/stagedetail/${stageId}/workTodo`)
    }



    const stateButton = (state) => {
        let dom = null;

        if (state === "0" && stageInfo?.workNumber > 0) {
            dom = <div className="stage-state-start-button" onClick={() => changeStateToStart()}>
                开始计划
            </div>
        }

        if (state === "0" && stageInfo?.workNumber <= 0) {
            dom = <Tooltip placement="bottom" title={"当前计划没有规划事项，不能开始"}>
                <div className="stage-state-disable-button">
                    开始计划
                </div>
            </Tooltip>


        }

        if (state === "1" && stageInfo?.workNumber > 0) {
            dom = <div className="stage-state-start-button" onClick={() => changeStateToEnd()}>
                完成计划
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

    const status = ["未完成", "进行中", "已完成"]
    return (
        <Row style={{ height: "100%", background: "var(--thoughtware-gray-600)", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="stage-survey">
                    <div className="stage-survey-top">
                        <div className="stage-info-box">
                            <div className="stage-info-top">
                                <div className="stage-info-title">
                                    <ImgComponent
                                        src={"project1.png"}
                                        alt=""
                                        className="list-img"
                                    />
                                    {stageInfo && stageInfo.stageName}
                                </div>
                                {
                                    stateButton(stageInfo?.status)
                                }
                            </div>

                            <div className="stage-container">
                                <div className="stage-item">
                                    <UserIcon userInfo={stageInfo?.master} size="big" className="item-icon" name={stageInfo?.master.nickname} />
                                    <div className="item-content">
                                        <div className="item-top">{stageInfo?.master?.nickname}</div>
                                        <div className="item-bottom">计划负责人</div>
                                    </div>
                                </div>
                                <div className="stage-work">
                                    <div className="stage-item" onClick={() => goWorkItemList("all")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.all}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="stage-item" onClick={() => goWorkItemList("pending")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.pending}</div>
                                            <div className="item-bottom">待办</div>
                                        </div>
                                    </div>
                                    <div className="stage-item" onClick={() => goWorkItemList("ending")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.ending}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                    <div className="stage-item" onClick={() => goWorkItemList("overdue")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.overdue}</div>
                                            <div className="item-bottom">已逾期</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="stage-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{status[stageInfo?.status]}</div>
                                        <div className="item-bottom">计划状态</div>
                                    </div>
                                </div>

                                <div className="stage-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{stageInfo?.startTime?.slice(0, 10)} ~ {stageInfo?.endTime?.slice(0, 10)}</div>
                                        <div className="item-bottom">计划计划周期</div>
                                    </div>
                                </div>

                                <div className="stage-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{stageInfo?.relaStartTime ? stageInfo?.relaStartTime.slice(0, 10) : "未开始"}  ~ {stageInfo?.relaEndTime ? stageInfo?.relaEndTime.slice(0, 10) : "未结束"}</div>
                                        <div className="item-bottom">计划实际周期</div>
                                    </div>
                                </div>

                                <div className="stage-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top item-progress"><Progress percent={percent} status="active" /></div>
                                        <div className="item-bottom">计划进度</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="burn-down-box">
                            <div className="stage-title">计划燃尽图</div>
                            <div className="burn-down" id="stage-burn-down">

                            </div>
                        </div>
                    </div>

                    <TodoListBox todoTaskList={todoTaskList} goToListPage={goToListPage} model={"stage"} />

                    <DynamicList logList={opLogList} goDynamicList={goDynamicList} goOpLogDetail={goOpLogDetail} />
                </div>
                <StageStartState
                    visible={startStateVisable}
                    projectId={projectId}
                    stageId={stageId}
                    StageSurveyStore={StageSurveyStore}
                    setVisible={setStartStateVisable}
                    stageInfo={stageInfo}
                    setStageInfo={setStageInfo}
                />
                <StageEndState
                    visible={endStateVisable}
                    projectId={projectId}
                    stageId={stageId}
                    StageSurveyStore={StageSurveyStore}
                    setVisible={setEndStateVisable}
                    stageInfo={stageInfo}
                    setStageInfo={setStageInfo}
                />
            </Col>
        </Row>

    )
}

export default observer(StageSurvey);