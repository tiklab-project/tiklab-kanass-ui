/*
 * @Descripttion: 项目概况
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:00:13
 */
import React, { useEffect, useState } from "react";
import "../components/Survey.scss"
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import moment from 'moment';
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts"
import { Row, Col, Empty, Progress } from "antd";
import ProjectSurveyStore from "../store/ProjectSurveyStore";
import Workstore from "../../../work/store/WorkStore";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import MilestoneTimeline from "../../milestone/components/MilestoneTimeline";
import TodoStatistics from "../../../home/common/components/TodoStatistics";
import DyncmicTimeAxis from "./DyncmicTimeAxis";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const Survey = (props) => {
    const { statWorkItemByBusStatus, findProject,
        findProjectBurnDowmChartPage, findMilestoneList, findlogpage, findtodopage,
        findRecentPage, recentList, updateRecent, logList } = ProjectSurveyStore;
    const { setWorkId } = Workstore;
    //当前用户名字
    const masterName = getUser().name;
    // 项目id
    const projectId = props.match.params.id;
    // 事项状态列表
    const [workStatusList, setWorkStatusList] = useState();
    // 项目详情
    const [project, setProject] = useState();
    // 待办列表
    const [todoList, setTodoList] = useState([]);
    // 日志列表
    // const [logList, setLogList] = useState([]);
    // 里程碑列表
    const [milestoneList, setMilestoneList] = useState();
    // 进度
    const [percent, setPercent] = useState()
    // 项目类型
    const userId = getUser().userId;
    useEffect(() => {
        // 统计各个状态的事项
        statWorkItemByBusStatus(projectId).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data.ending / res.data.all * 100;
            setPercent(percent ? percent.toFixed(2) : 0)
        })

        // 获取项目详情
        findProject(projectId).then(res => {
            setProject(res.data)
        })

        // 获取日志列表
        findlogpage({ projectId: projectId, currentPage: 1 })

        // 获取待办列表
        findtodopage({ projectId: projectId, currentPage: 1, userId: userId }).then(res => {
            if (res.code === 0) {
                setTodoList(res.data.dataList)
            }
        })

        // 获取里程碑列表
        findMilestoneList(projectId).then(res => {
            if (res.code === 0) {
                setMilestoneList(res.data)
            }
        })

        findRecentPage(userId)
        return;
    }, [])


    useEffect(() => {
        if (project) {
            // 获取项目燃尽图列表
            findProjectBurnDowmChartPage(projectId).then(res => {
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
                        Yaxis.push(project.worklItemNumber);
                        workCountYaixs.push(project.worklItemNumber);
                        let i = 1;
                        for (i = 1; i <= 6; i++) {
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(project.worklItemNumber);
                            Yaxis.push(project.worklItemNumber * (7 - i) / 7);
                        }
                    }
                    burnDownChart(timerXaixs, workCountYaixs, Yaxis)
                }
            })
        }
        return;
    }, [project])

    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "1":
                data = "未开始";
                break;
            case "2":
                data = "已启动";
                break;
            case "3":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }

    /**
     * 燃尽图
     */
    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('burn-down'));
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

    /**
    * 跳转到动态列表
    */
    const goDynamicList = () => {
        props.history.push(`/project/${projectId}/dynamic`)
    }


    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (value) => {
        props.history.push(`/project/${projectId}/workitem`)
    }



    return (
        <Row className="project-survey-row">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-survey">
                    <div className="upper-box">
                        <div className="project-box">
                            <div className="box-title">
                                <span>
                                    <ImgComponent
                                        alt=""
                                        className="list-img"
                                        src={project?.iconUrl}
                                    />
                                    {project && project.projectName}
                                </span>
                            </div>
                            <div className="project-container">
                                <div className="project-item">
                                    <UserIcon userInfo={project?.master} size={"big"} className="item-icon" name={masterName} />
                                    <div className="item-content">
                                        <div className="item-top">{project?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="project-work">
                                    <div className="project-item status-item" onClick={() => goWorkItemList("all")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.all}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("pending")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.pending}</div>
                                            <div className="item-bottom">待办</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("ending")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.ending}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("overdue")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.overdue}</div>
                                            <div className="item-bottom">已逾期</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="project-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{statusSet(project?.projectState)}</div>
                                        <div className="item-bottom">项目状态</div>
                                    </div>
                                </div>

                                <div className="project-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{project?.startTime} ~ {project?.endTime}</div>
                                        <div className="item-bottom">项目状态</div>
                                    </div>
                                </div>

                                <div className="project-item project-progress">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top item-progress"><Progress percent={percent} status="active" /></div>
                                        <div className="item-bottom">项目进度</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="burn-down-box">
                            <div className="box-title">项目燃尽图</div>
                            <div className="burn-down" id="burn-down">

                            </div>
                        </div>
                    </div>
                    <div className="milestone-box">
                        <div className="box-title">
                            里程碑
                        </div>
                        <div className="milestone-box-timeline">
                            {
                                milestoneList?.length > 0 ?
                                    <MilestoneTimeline milestonelist={milestoneList} />
                                    :
                                    <ProjectEmpty description="暂时没有里程碑~" />
                            }

                        </div>
                    </div>
                    <TodoStatistics />
                    <div className="log-box">
                        <div className="log-box-title">
                            <div className="name">最新动态</div>
                            <div className="more" onClick={() => goDynamicList()}>
                                <svg aria-hidden="true" className="svg-icon">
                                    <use xlinkHref="#icon-rightjump"></use>
                                </svg>
                            </div>
                        </div>
                        {
                            logList && logList.length > 0 ? <DyncmicTimeAxis logList={logList} /> : <ProjectEmpty description="暂时没有动态~" />
                        }
                    </div>

                    {/* <TodoListBox todoTaskList = {todoList} goToListPage = {goToListPage} model = {"project"}/> */}
                    {/* <DyncmicList logList = {logList} goDynamicList = {goDynamicList} goOpLogDetail = {goOpLogDetail} /> */}
                </div>
            </Col>
        </Row>
    )
}

export default observer(Survey);