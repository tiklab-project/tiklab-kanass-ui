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
import { getUser } from 'tiklab-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";

const SprintSurvey = (props) => {
    const { sprintSurveyStore } = props;
    const { StatSprintProcessWorkItem, StatSprintWorkItemByBusStatus,
        FindSprint, FindSprintBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList } = sprintSurveyStore;

    const [workStatusList, setWorkStatusList] = useState();

    const sprintId = props.match.params.sprint;
    const [workItemList, setWorkItemList] = useState();
    const [sprintInfo, setSprintInfo] = useState()
    const masterId = getUser().userId;
    const masterName = getUser().name;
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

        findlogpage()

        findtodopage({ userId: masterId })

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


    return (
        <Row style={{ height: "100%", background: "#f9f9f9" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="sprint-survey">
                    <div className="sprint-survey-top">
                        {/* <div className="top-left">
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
                        </div> */}
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
                                    <UserIcon userInfo={sprintInfo?.master} className="item-icon" name = {masterName}/>
                                    <div className="item-content">
                                        <div className="item-top">{sprintInfo?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="sprint-work">
                                    <div className="sprint-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">0</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-nostart"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">0</div>
                                            <div className="item-bottom">未开始</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">0</div>
                                            <div className="item-bottom">进行中</div>
                                        </div>
                                    </div>
                                    <div className="sprint-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">0</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">已开始</div>
                                        <div className="item-bottom">迭代状态</div>
                                    </div>
                                </div>

                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">2022-10-21 ~ 2022-10-22</div>
                                        <div className="item-bottom">迭代周期状态</div>
                                    </div>
                                </div>

                                <div className="sprint-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top item-progress"><Progress percent={100} status="active" /></div>
                                        <div className="item-bottom">迭代进度</div>
                                    </div>
                                </div>
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
                        <div className="sprint-pending-workitem">
                            <div className="sprint-title">
                                <span className="name">待办事项</span>
                                {
                                    todoTaskList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectScrumDetail/:id/sprintdetail/${sprintId}/workTodo`) }}>
                                        <svg aria-hidden="true" className="svg-icon">
                                            <use xlinkHref="#icon-rightjump"></use>
                                        </svg>
                                    </div>
                                }

                            </div>
                            <div className="sprint-pending-workitem-list">
                                {
                                    todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                        return <div
                                            dangerouslySetInnerHTML={{ __html: item.data }}
                                            className="dynamic-item"
                                            key={item.id}
                                            onClick={() => goTodoDetail(item.link)}
                                        />
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="暂时没有待办~" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="sprint-survey-middle">
                        <div className="sprint-sprint-box" >
                            <div className="dynamic-box">
                                <div className="sprint-title">
                                    <span className="name">相关动态</span>
                                    {
                                        opLogList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectScrumDetail/:id/sprintdetail/${sprintId}/dynamic`) }}>
                                            <svg aria-hidden="true" className="svg-icon">
                                                <use xlinkHref="#icon-rightjump"></use>
                                            </svg>
                                        </div>
                                    }

                                </div>
                                <div className="dynamic-list">
                                    {
                                        opLogList > 0 ? opLogList.map(item => {
                                            return <div
                                                dangerouslySetInnerHTML={{ __html: item.data }}
                                                className="dynamic-item"
                                                onClick={() => goOpLogDetail(item.link)}
                                                key={item.id}
                                            />
                                        })
                                            :
                                            <Empty image="/images/nodata.png" description="暂时没有动态~" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="sprint-survey-bottom">
                        <div className="bottom-left">
                            <div className="title">我的事项</div>
                            <div className="sprint-survey-work">
                                {
                                    workStatusList && workStatusList.map((item, index) => {
                                        return <div className="work-item" key={index}>
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-workitemstate"></use>
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
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-workItemProcess"></use>
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
                    </div> */}
                </div>
            </Col>
        </Row>

    )
}

export default inject('sprintSurveyStore')(observer(SprintSurvey));