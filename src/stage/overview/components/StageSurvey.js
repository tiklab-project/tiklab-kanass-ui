import {observer} from "mobx-react";
import StageSurveyStore from "../../../stage/overview/store/StageSurveyStore";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import echarts from "../../../common/echarts/echarts";
import {Col, Progress, Row, Select, Tooltip} from "antd";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import UserIcon from "../../../common/UserIcon/UserIcon";
import {ClockCircleOutlined, CloseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import TodoStatistics from "../../../home/common/components/TodoStatistics";
import DynamicList from "../../../common/overviewComponent/DynamicList";
// import StageStartState from "../../../stage/overview/components/StageStartState";
// import StageEndState from "../../../stage/overview/components/StageEndState";
import "./StageSurvey.scss"
import { getUser } from "tiklab-core-ui"

const StageSurvey = (props) => {
    const { findStage, findStageBurnDowmChartPage, findLogPageByTime,
        logList,findtodopage,  findWorkItemNumByQuickSearch, updateStage } = StageSurveyStore;

    const stageId = props.match.params.stage;
    const projectId = props.match.params.id;
    const [stageInfo, setStageInfo] = useState()
    const masterId = getUser().userId;
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
                            timerXaixs.push(item.recordTime.slice(0, 10));
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

        // 查找版本下全部、待办、已完成、已逾期的事项个数
        findWorkItemNumByQuickSearch(data).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data?.ending / res.data?.all;
            setPercent(percent * 100 ? (percent * 100).toFixed(2) : 0)
        })

        //按照时间顺序查找日志
        findLogPageByTime({data: { stageId: stageId }})

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
        props.history.push(`/${projectId}/stage/${stageId}/workitem`)
    }
    const goDynamicList = () => {
        props.history.push(`/${projectId}/stage/${stageId}/dynamic`)

    }




    const stateButton = (state) => {
        let dom = null;

        if (state === "000000" && stageInfo?.workNumber > 0) {
            dom = <div className="stage-state-start-button" onClick={() => changeStateToStart()}>
                开始阶段
            </div>
        }

        if (state === "000000" && stageInfo?.workNumber <= 0) {
            dom = <Tooltip placement="bottom" title={"当前阶段没有规划事项，不能开始"}>
                <div className="stage-state-disable-button">
                    开始阶段
                </div>
            </Tooltip>


        }

        if (state === "111111" && stageInfo?.workNumber > 0) {
            dom = <div className="stage-state-start-button" onClick={() => changeStateToEnd()}>
                完成阶段
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

    const handleChange = (value) => {
        const param = {
            id: stageId,
            status: value
        }
        updateStage(param).then(res => {
            findStage({ stageId: stageId }).then(res => {
                setStageInfo(res.data)
            })
        })
    }

    return (
        <Row className="stage-survey-row">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="stage-survey">
                    <div style={{
                        height: "100%"
                    }}>
                        <div className="stage-survey-top">
                            <div className="stage-info-box">
                                <div className="stage-info-top">
                                    <div className="stage-info-title">
                                        <ColorIcon name={stageInfo?.stageName} className="icon-24" color={stageInfo?.color} />
                                        {stageInfo && stageInfo.stageName}
                                    </div>
                                </div>

                                <div className="stage-container">
                                    <div className="stage-item">
                                        <UserIcon userInfo={stageInfo?.master} size="big" className="item-icon" name={stageInfo?.master.nickname} />
                                        <div className="item-content">
                                            <div className="item-top">{stageInfo?.master?.nickname}</div>
                                            <div className="item-bottom">阶段负责人</div>
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
                                            <div className="item-top">
                                                <Select
                                                    className={`stage-state-select stage-state-select${stageInfo?.status === "2" ? "-done" : stageInfo?.status === "1" ? "-process" : "-todo"}`}
                                                    defaultValue={"--"}
                                                    dropdownMatchSelectWidth={false}
                                                    value={stageInfo?.status === "2" ? "已完成" : stageInfo?.status === "1" ? "进行中" : "未开始"}
                                                    bordered={false}
                                                    showArrow={false}
                                                    // disabled={project?.projectState === "3" ? true : false}
                                                    onChange={handleChange}
                                                >
                                                    {
                                                        stageInfo?.status === "0" ?
                                                            <Select.Option value="1">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <PlayCircleOutlined />
                                                                </span>
                                                                开始阶段
                                                            </Select.Option>
                                                            : stageInfo?.status === "1" ?
                                                                <Select.Option value="2">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <CloseCircleOutlined />
                                                                </span>
                                                                    结束阶段
                                                                </Select.Option> :
                                                                <Select.Option value="1">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <PlayCircleOutlined />
                                                                </span>
                                                                    开始阶段
                                                                </Select.Option>
                                                    }
                                                </Select>
                                            </div>
                                            <div className="item-bottom">阶段状态</div>
                                        </div>
                                    </div>

                                    <div className="stage-item">
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-date"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{stageInfo?.startTime.slice(0, 10)} ~ {stageInfo?.endTime.slice(0, 10)}</div>
                                            <div className="item-bottom">阶段计划周期</div>
                                        </div>
                                    </div>

                                    <div className="stage-item">
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-date"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{stageInfo?.relaStartTime ? stageInfo?.relaStartTime.slice(0, 10) : "未开始"}  ~ {stageInfo?.status === "222222" ? stageInfo?.relaEndTime.slice(0, 10) : "未结束"}</div>
                                            <div className="item-bottom">阶段实际周期</div>
                                        </div>
                                    </div>

                                    <div className="stage-item">
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-rate"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top item-progress"><Progress percent={percent} status="active" /></div>
                                            <div className="item-bottom">阶段进度</div>
                                        </div>
                                    </div>
                                    {/*<div className="stage-item">*/}
                                    {/*    <div className="item-group">*/}
                                    {/*        <ClockCircleOutlined style={{fontSize:"20px", color:"grey"}} />*/}
                                    {/*        <div className="item-content">*/}
                                    {/*            <div className="item-top">{stageInfo?.estimateTime}  小时</div>*/}
                                    {/*            <div className="item-bottom">阶段预计工时</div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="item-group">*/}
                                    {/*        <ClockCircleOutlined style={{fontSize:"20px", color:"grey"}} />*/}
                                    {/*        <div className="item-content">*/}
                                    {/*            <div className="item-top">{stageInfo?.surplusTime}  小时</div>*/}
                                    {/*            <div className="item-bottom">阶段剩余工时</div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div className="burn-down-box">
                                <div className="stage-title">阶段燃尽图</div>
                                <div className="burn-down" id="stage-burn-down">

                                </div>
                            </div>
                        </div>

                        {/* <TodoListBox todoTaskList={todoTaskList} goToListPage={goToListPage} model={"stage"} /> */}
                        <TodoStatistics />

                        <DynamicList logList={logList} goDynamicList={goDynamicList} goOpLogDetail={goOpLogDetail} />
                    </div>
                </div>
                {/*<StageStartState*/}
                {/*    visible={startStateVisable}*/}
                {/*    projectId={projectId}*/}
                {/*    stageId={stageId}*/}
                {/*    StageSurveyStore={StageSurveyStore}*/}
                {/*    setVisible={setStartStateVisable}*/}
                {/*    stageInfo={stageInfo}*/}
                {/*    setStageInfo={setStageInfo}*/}
                {/*/>*/}
                {/*<StageEndState*/}
                {/*    visible={endStateVisable}*/}
                {/*    projectId={projectId}*/}
                {/*    stageId={stageId}*/}
                {/*    StageSurveyStore={StageSurveyStore}*/}
                {/*    setVisible={setEndStateVisable}*/}
                {/*    stageInfo={stageInfo}*/}
                {/*    setStageInfo={setStageInfo}*/}
                {/*/>*/}
            </Col>
        </Row>
    )
}

export default observer(StageSurvey);