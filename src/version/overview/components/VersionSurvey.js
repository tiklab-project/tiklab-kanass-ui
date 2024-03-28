/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 15:47:40
 */
import React, { useEffect, useState } from "react";
import "../components/versionSurvey.scss";
import { Row, Col, Progress, Empty, Select, Tooltip } from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";
import moment from 'moment';
import VersionSurveyStore from "../store/VersionSurveyStore";
import WorkStore from "../../../work/store/WorkStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoListBox from "../../../common/overviewComponent/TodoListBox";
import VersionStartState from "./VersionStartState";
import VersionEndState from "./VersionEndState";
const VersionSurvey = (props) => {
    const { findVersion, FindVersionBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList, findWorkItemNumByQuickSearch, userList, getUseList } = VersionSurveyStore;

    const versionId = props.match.params.version;
    const [versionInfo, setVersionInfo] = useState();
    const projectId = props.match.params.id;
    const masterId = getUser().userId;
    const [workStatusList, setWorkStatusList] = useState();
    // 进度
    const [percent, setPercent] = useState()
    useEffect(() => {
        const data = {
            masterId: masterId,
            versionId: versionId,
            projectId: projectId
        }
        findWorkItemNumByQuickSearch(data).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data?.ending / res.data?.all;
            setPercent(percent ? percent.toFixed(2) : 0)
        })
        findVersion({ versionId: versionId }).then(res => {
            setVersionInfo(res.data)
            const version = res.data;
            FindVersionBurnDowmChartPage(versionId).then(res => {
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
                        Yaxis.push(version.workNumber);
                        workCountYaixs.push(version.workNumber);
                        let i = 1;
                        for (i = 1; i <= 6; i++) {
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(version.workNumber);
                            Yaxis.push(version.workNumber * (7 - i) / 7);
                        }
                    }
                    burnDownChart(timerXaixs, workCountYaixs, Yaxis)
                }
            })
        })
        // 燃尽图
        getUseList(projectId)

        findlogpage({ userId: masterId, versionId: versionId })

        findtodopage({ userId: masterId, versionId: versionId })

        return;
    }, [versionId]);
    const [fieldName, setFieldName] = useState("")
    /**
     * 燃尽图
     */
    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('version-burn-down'));
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
    * 跳转到动态列表
    */
    const goDynamicList = () => {
        props.history.push(`/${projectId}/versiondetail/${versionId}/dynamic`)
        
    }

    const goTodoDetail = (url) => {
        window.location.href = url
    }

    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (value) => {
        props.history.push(`/${projectId}/versiondetail/${versionId}/workTable`)
    }
    const goToListPage = () => {
        props.history.push(`/${projectId}/versiondetail/${versionId}/workTodo`) 
    }


    const stateButton = (state) => {
        let dom = null;

        if (state === "000000" && versionInfo?.workNumber > 0) {
            dom = <div className="version-state-start-button" onClick={() => changeStateToStart()}>
                开始版本
            </div>
        }

        if (state === "000000" && versionInfo?.workNumber <= 0) {
            dom = <Tooltip placement="bottom" title={"当前版本没有规划事项，不能开始"}>
                <div className="version-state-disable-button">
                    开始版本
                </div>
            </Tooltip>


        }

        if (state === "111111" && versionInfo?.workNumber > 0) {
            dom = <div className="version-state-start-button" onClick={() => changeStateToEnd()}>
                完成版本
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
                <div className="version-survey">
                    <div className="version-survey-top">
                        <div className="version-info-box">
                            {/* <div className="version-info-title">
                                <img
                                    src={('/images/version.png')}
                                    alt=""
                                    className="list-img"
                                />
                                {versionInfo && versionInfo.name}
                            </div> */}
                             <div className="version-info-top">
                                <div className="version-info-title">
                                    <img
                                        src={('/images/project1.png')}
                                        alt=""
                                        className="list-img"
                                    />
                                    {versionInfo && versionInfo.name}
                                </div>
                                {
                                    stateButton(versionInfo?.versionState.id)
                                }
                            </div>
                            <div className="version-container">
                                <div className="version-item">
                                    <UserIcon userInfo={versionInfo?.master} size="big" className="item-icon" name={versionInfo?.master.nickname} />
                                    <div className="item-content">
                                        <div className="item-top">{versionInfo?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="version-work">
                                    <div className="version-item" onClick={() => goWorkItemList("all")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.all}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="version-item" onClick={() => goWorkItemList("pending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-nostart"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.pending}</div>
                                            <div className="item-bottom">待办</div>
                                        </div>
                                    </div>
                                    <div className="version-item" onClick={() => goWorkItemList("ending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.ending}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                    <div className="version-item" onClick={() => goWorkItemList("overdue")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.overdue}</div>
                                            <div className="item-bottom">已逾期</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="version-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{versionInfo?.versionState?.name}</div>
                                        <div className="item-bottom">版本状态</div>
                                    </div>
                                </div>

                                <div className="version-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{versionInfo?.startTime.slice(0, 10)} ~ {versionInfo?.publishTime.slice(0, 10)}</div>
                                        <div className="item-bottom">版本周期状态</div>
                                    </div>
                                </div>

                                <div className="version-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{versionInfo?.relaStartTime ? versionInfo?.relaStartTime.slice(0, 10) : "未开始"}  ~ {versionInfo?.relaPublishTime ? versionInfo?.relaPublishTime.slice(0, 10) : "未发布"}</div>
                                        <div className="item-bottom">版本实际周期</div>
                                    </div>
                                </div>
                                <div className="version-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top item-progress"><Progress percent={100} status="active" /></div>
                                        <div className="item-bottom">版本进度</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="burn-down-box">
                            <div className="version-title">版本燃尽图</div>
                            <div className="burn-down" id="version-burn-down">

                            </div>
                        </div>
                    </div>
                    <TodoListBox todoTaskList = {todoTaskList} goToListPage = {goToListPage} model = {"version"}/>
                    <DynamicList logList = {opLogList} goDynamicList = {goDynamicList} goOpLogDetail = {goOpLogDetail}/>

                </div>
                <VersionStartState
                    visible={startStateVisable}
                    projectId={projectId}
                    versionId={versionId}
                    VersionSurveyStore={VersionSurveyStore}
                    setVisible={setStartStateVisable}
                    versionInfo={versionInfo}
                    setVersionInfo={setVersionInfo}
                />
                <VersionEndState
                    visible={endStateVisable}
                    projectId={projectId}
                    versionId={versionId}
                    VersionSurveyStore={VersionSurveyStore}
                    setVisible={setEndStateVisable}
                    versionInfo={versionInfo}
                    setVersionInfo={setVersionInfo}
                />
            </Col>
        </Row>

    )
}

export default observer(VersionSurvey);