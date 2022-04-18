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
import { Row, Col, Progress } from 'antd';
import { observer, inject } from "mobx-react";
import {getUser} from 'doublekit-core-ui';
import * as echarts from 'echarts';

const SprintSurvey = (props) => {
    const { sprintSurveyStore } = props;
    const { StatSprintProcessWorkItem, StatSprintWorkItemByBusStatus, FindSprint, FindSprintBurnDowmChartPage } = sprintSurveyStore;

    const [workStatusList, setWorkStatusList] = useState();

    const sprintId = localStorage.getItem("sprintId");
    const [workItemList, setWorkItemList] = useState();
    const [sprintInfo, setSprintInfo] = useState()
    const masterId = getUser().userId;
    useEffect(() => {
        const data = {
            masterId: masterId,
            sprintId: sprintId
        }
        FindSprint({ sprintId: sprintId }).then(res => {
            setSprintInfo(res.data)
        })
        StatSprintWorkItemByBusStatus({ sprintId: sprintId }).then(res => {
            setWorkStatusList(res.data)
        })
        StatSprintProcessWorkItem(data).then((res) => {
            setWorkItemList(res.data)
        })
        // 燃尽图
        FindSprintBurnDowmChartPage(sprintId).then(res => {

            if (res.code === 0) {
                let timerXaixs = [];
                let workCountYaixs = [];
                let Yaxis = [];
                res.data.dataList.map((item, index) => {
                    timerXaixs.push(item.recordTime);
                    workCountYaixs.push(item.remainWorkItemCount);
                    Yaxis.push(item.totalWorkItemCount * (7 - index) / 7);
                    return;
                })
                burnDownChart(timerXaixs, workCountYaixs, Yaxis)
            }
        })
    }, [])

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

    return (
        <Row>
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 20, offset: 2 }}>
                <div className="sprint-survey">
                    <div className="sprint-survey-top">
                        <div className="top-left">
                            <div className="title">迭代信息</div>
                            <div className="box-top">
                                <div className="text sprint-status">迭代状态：{sprintInfo && sprintInfo.sprintState.name}</div>
                                <div className="text sprint-assign">负责人：{sprintInfo && sprintInfo.master && sprintInfo.master.name || ""}</div>
                            </div>
                            <div className="box-middle">
                                <div className="sprint-time">
                                    <div className="text start-text">开始时间：</div>
                                    <div className="text start-time">{sprintInfo && sprintInfo.startTime}</div>
                                </div>
                                <div className="sprint-time">
                                    <div className="text end-text">结束时间：</div>
                                    <div className="text end-time">{sprintInfo && sprintInfo.endTime}</div>
                                </div>
                            </div>
                            <div className="box-bottom">
                                <div>
                                    迭代进度：
                                </div>
                                <Progress percent={50} status="active" />
                            </div>
                        </div>
                        <div className="top-right">
                            <div className="title">剩余时间</div>
                            <div className="sprint-day">
                                <div className="sprint-white">
                                    9
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sprint-survey-middle">
                        <div className="title">迭代燃尽图</div>
                        <div className="burn-down" id="sprint-burn-down" style={{ width: "100%", height: "500px" }} />
                    </div>
                    <div className="sprint-survey-bottom">
                        <div className="bottom-left">
                            <div className="title">我的事项</div>
                            <div className="sprint-survey-work">
                                {
                                    workStatusList && workStatusList.map((item, index) => {
                                        return <div className="work-item" key={index}>
                                            <svg className="work-icon" aria-hidden="true">
                                                <use xlinkHref="#icondingqigongzuo"></use>
                                            </svg>
                                            <div className="work-count">
                                                <div className="work-num">{item.groupCount}</div>
                                                <div className="work-text">{item.statusName}</div>
                                            </div>
                                        </div>
                                    })
                                }

                            </div>
                        </div>
                        <div className="bottom-right">
                            <div className="title">进行中事项</div>
                            <div className="sprint">
                                {
                                    workItemList && workItemList.map((item, index) => {
                                        return <div className="sprint-item" key={index}>
                                            <div className="sprint-item-left">
                                                <svg className="sprint-icon" aria-hidden="true">
                                                    <use xlinkHref="#iconzuoyepiaotiaoyue"></use>
                                                </svg>
                                                <div className="sprint-name">
                                                    {item.title}
                                                </div>
                                            </div>


                                            <div className="sprint-date">
                                                {item.planBeginTime} ~ {item.planEndTime}
                                            </div>
                                            <div className="sprint-process">
                                                50%
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>

    )
}

export default inject('sprintSurveyStore')(observer(SprintSurvey));