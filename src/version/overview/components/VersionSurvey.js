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
import { Row, Col, Progress, Empty, Select } from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from 'tiklab-core-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts";
import moment from 'moment';
import VersionSurveyStore from "../store/VersionSurveyStore";
import WorkStore from "../../../work/store/WorkStore";
import { CaretDownOutlined } from '@ant-design/icons';
const VersionSurvey = (props) => {
    const { findVersion, FindVersionBurnDowmChartPage, opLogList, findlogpage,
        findtodopage, todoTaskList, statWorkItemByBusStatus, userList, getUseList } = VersionSurveyStore;
    const { setSearchType } = WorkStore;

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
        statWorkItemByBusStatus(data).then(res => {
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
    }, [versionId])
    const [hoverFieldName, setHoverFieldName] = useState("")
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
    const goTodoDetail = (url) => {
        window.location.href = url
    }

    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (value) => {
        setSearchType(value)
        props.history.push(`/index/${projectId}/versiondetail/${versionId}/work/table`)
    }
    const changeFieldName = (value) => {
        setFieldName(value)
    }
    return (
        <Row style={{ height: "100%", background: "var(--tiklab-gray-600)" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="version-survey">
                    <div className="version-survey-top">
                        <div className="version-info-box">
                            <div className="version-info-title">
                                <img
                                    src={('/images/version.png')}
                                    alt=""
                                    className="list-img"
                                />
                                {versionInfo && versionInfo.name}
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
                                        <div className="item-top">已开始</div>
                                        <div className="item-bottom">版本状态</div>
                                    </div>
                                </div>

                                <div className="version-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{versionInfo?.startTime} ~ {versionInfo?.publishDate}</div>
                                        <div className="item-bottom">版本周期状态</div>
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
                    <div className="version-pending-workitem">
                            <div className="version-title">
                                <span className="name">待办事项</span>
                                {
                                    todoTaskList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectScrumDetail/:id/versiondetail/${versionId}/workTodo`) }}>
                                        <svg aria-hidden="true" className="svg-icon">
                                            <use xlinkHref="#icon-rightjump"></use>
                                        </svg>
                                    </div>
                                }

                            </div>
                            <div className="version-pending-workitem-list">
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
                    {/* <div className="version-survey-middle">
                        <div className="version-version-box" >
                            
                        </div>
                    </div> */}
                    <div className="dynamic-box">
                        <div className="version-title">
                            <span className="name">相关动态</span>
                            {
                                opLogList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectScrumDetail/:id/versiondetail/${versionId}/dynamic`) }}>
                                    <svg aria-hidden="true" className="svg-icon">
                                        <use xlinkHref="#icon-rightjump"></use>
                                    </svg>
                                </div>
                            }

                        </div>
                        <div className="dynamic-list">
                            {
                                opLogList.length > 0 ? opLogList.map(item => {
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
            </Col>
        </Row>

    )
}

export default observer(VersionSurvey);