/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:00:13
 */
import React, { useEffect, useState } from "react";
import "../components/Survey.scss"
import { observer, inject } from "mobx-react";
import { getUser } from 'tiklab-core-ui';
import moment from 'moment';
import MyWorkStatistics from "./MyWorkStatistics";
import { Profile } from "tiklab-eam-ui"
import echarts from "../../../common/echarts/echarts"
import { Row, Col, Empty, Progress } from "antd";

const Survey = (props) => {
    // 基于准备好的dom，初始化echarts实例
    const { projectSurveyStore, homeStore, workStore } = props;
    const { statWorkItemByBusStatus, statProjectManageSprint, findProject,
        findDynamicPage, findProjectBurnDowmChartPage, findMilestoneList,
        statProjectWorkItemProcess, findlogpage, findtodopage } = projectSurveyStore;


    const masterId = getUser().userId;
    const projectId = props.match.params.id;
    const [workStatusList, setWorkStatusList] = useState();
    const [sprintList, setSprintList] = useState();
    const [project, setProject] = useState();
    const [todoList, setTodoList] = useState([]);
    const [logList, setLogList] = useState([]);
    const [milestoneList, setMilestoneList] = useState();
    const [percent, setPercent] = useState()

    const path = props.match.path.split("/")[2];
    useEffect(() => {
        const data = {
            masterId: masterId,
            projectId: projectId
        }

        statWorkItemByBusStatus(projectId).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data[3].groupCount / res.data[0].groupCount;
            setPercent(percent.toFixed(2))
        })

        statProjectManageSprint(data).then((res) => {
            if (res.code === 0) {
                setSprintList(res.data.slice(0, 3))
            }

        })

        findProject(projectId).then(res => {
            setProject(res.data)
        })

        findlogpage({ projectId: projectId, currentPage: 1 }).then(res => {
            if (res.code === 0) {
                setLogList(res.data.dataList)
            }
        })

        findtodopage({ projectId: projectId, currentPage: 1 }).then(res => {
            if (res.code === 0) {
                setTodoList(res.data.dataList)
            }
        })

        findMilestoneList(projectId).then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setMilestoneList(res.data)
            }
        })
        return;
    }, [])


    useEffect(() => {
        if (project) {
            findProjectBurnDowmChartPage(projectId).then(res => {
                if (res.code === 0) {
                    let timerXaixs = [];
                    let workCountYaixs = [];
                    let Yaxis = [];
                    if (res.data.dataList.length > 0) {
                        res.data.dataList.map((item, index) => {
                            timerXaixs.push(item.recordTime);
                            workCountYaixs.push(item.remainWorkItemCount);
                            Yaxis.push(item.totalWorkItemCount * (7 - index) / 7);
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
            // title: {
            //     text: '燃尽图'
            // },
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



    // const goWorkItemDetail = (id) => {
    //     props.history.push(`/index/${path}/${projectId}/workone/${id}`)
    // }
    const goTodoWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/workTodo`)
    }

    const goDynamicList = () => {
        props.history.push(`/index/${path}/${projectId}/dynamic`)
    }

    // const goTodoWorkItemList = () => {
    //     props.history.push(`/index/workTodo`)
    //     // sessionStorage.setItem("menuKey", "work")
    // }

    const goOpLogDetail = (url) => {
        window.location.href = url
    }

    const goTodoDetail = (url) => {
        window.location.href = url
    }

    return (
        <Row style={{ height: "100%", backgroundColor: "var(--tiklab-gray-600)", overflow: "auto" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-survey">
                    <div className="upper-box">
                        <div className="project-box">
                            <div className="project-title">
                                {/* <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-zhuti"></use>
                                </svg> */}
                                {
                                    project?.iconUrl ?
                                        <img
                                            src={('/images/' + project.iconUrl)}
                                            alt=""
                                            className="list-img"
                                        />
                                        :
                                        <img
                                            src={('/images/project1.png')}
                                            alt=""
                                            className="list-img"
                                        />

                                }
                                {project && project.projectName}
                            </div>
                            <div className="project-container">
                                <div className="project-item">
                                    <Profile userInfo={project?.master} className="item-icon" />
                                    <div className="item-content">
                                        <div className="item-top">{project?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="project-work">
                                    <div className="project-item">
                                        {/* <img
                                            src={('/images/project1.png')}
                                            alt=""
                                            className="svg-icon"
                                        /> */}
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[0].groupCount}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="project-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-nostart"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[1].groupCount}</div>
                                            <div className="item-bottom">未开始</div>
                                        </div>
                                    </div>
                                    <div className="project-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[3].groupCount}</div>
                                            <div className="item-bottom">进行中</div>
                                        </div>
                                    </div>
                                    <div className="project-item">
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[2].groupCount}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="project-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{statusSet(project?.projectState)}</div>
                                        <div className="item-bottom">项目状态</div>
                                    </div>
                                </div>

                                <div className="project-item">
                                    <svg className="status-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="item-content">
                                        <div className="item-top">{project?.startTime} ~ {project?.endTime}</div>
                                        <div className="item-bottom">项目周期状态</div>
                                    </div>
                                </div>

                                <div className="project-item">
                                    <svg className="status-img" aria-hidden="true">
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
                            <div className="burn-down-title">项目燃尽图</div>
                            <div className="burn-down" id="burn-down">

                            </div>
                        </div>
                    </div>

                    <div className="center-box">
                        <MyWorkStatistics workStatusList={workStatusList} projectId={projectId} {...props}></MyWorkStatistics>
                    </div>
                   
                    <div className="third-box">
                        <div className="pending-todo">
                            <div className="pending-todo-title">
                                <span className="name">待办任务</span><div className="more" onClick={() => goTodoWorkItemList()}>
                                    <svg aria-hidden="true" className="svg-icon">
                                        <use xlinkHref="#icon-rightjump"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="pending-todo-list">
                                {
                                    todoList.length > 0 ? todoList.map(item => {
                                        return <div
                                            dangerouslySetInnerHTML={{ __html: item.data }}
                                            className="todo-list-item"
                                            onClick={() => goTodoDetail(item.link)}
                                        />
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="暂时没有待办~" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="third-box">
                        <div className="dynamic-box">
                            <div className="dynamic-box-title">
                                <div className="name">相关动态</div>
                                <div className="more" onClick={() => goDynamicList()}>
                                    <svg aria-hidden="true" className="svg-icon">
                                        <use xlinkHref="#icon-rightjump"></use>
                                    </svg>
                                </div>

                                {/* <div className="more" onClick={() => { props.history.push(`/index/sprint/${userId}`) }}>更多...</div> */}
                            </div>
                            <div className="dynamic-list">
                                {
                                    logList.length > 0 ? logList.map(item => {
                                        return <div
                                            dangerouslySetInnerHTML={{ __html: item.data }}
                                            className="dynamic-item"
                                            onClick={() => goOpLogDetail(item.link)}
                                        />
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="暂时没有动态~" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bottom-box">
                        <div className="sprint-box" >
                            <div className="sprint-box-title">
                                <div className="name">我的迭代</div>
                                <div className="more" onClick={() => { props.history.push(`/index/prodetail/sprint`) }}>更多...</div>
                            </div>
                            <div className="sprint-list">
                                {
                                    sprintList && sprintList.map((item) => {
                                        return <div className="sprint-item"
                                            key={item.id}
                                            onClick={() => goSprintdetail(item.project.id, item.project.projectType.id, item.id)}>
                                            <div className="sprint-item-left">
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-zuoyepiaotiaoyue"></use>
                                                </svg>
                                                <div className="sprint-name">
                                                    <div className="name">{item.sprintName}</div>
                                                    <div className="sprint-date">{item.startTime} ~ {item.endTime}</div>
                                                </div>
                                            </div>

                                            <div className="sprint-project">
                                                项目1
                                            </div>
                                            <div className="sprint-process">
                                                50%
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                        <div className="epic-box">
                            <div className="epic-box-title">
                                里程碑
                            </div>
                            <div className="epic-box-timeline">
                                <div className="timeline-item" key="first">
                                    <div className="timeline-text"></div>
                                    <div className="timeline-center">
                                        <div className="time-point">
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-xiayiqu"></use>
                                            </svg>
                                        </div>
                                        <div className="time-line">

                                        </div>
                                    </div>
                                    <div className="timeline-text"></div>
                                    <div className="timeline-text"></div>
                                </div>
                                {
                                    milestoneList && milestoneList.map((item, index) => {
                                        return <div className="timeline-item" key={item.id}>
                                            <div className="timeline-text"> </div>
                                            <div className="timeline-center">
                                                <div className="time-line"></div>
                                                <div className="time-point">
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref="#icon-xiayiqu"></use>
                                                    </svg>
                                                </div>
                                                <div className="time-line"></div>
                                            </div>
                                            <div className="timeline-text">里程碑1</div>
                                            <div className="timeline-text">2022-09-01</div>
                                        </div>
                                    })
                                }
                                <div className="timeline-item" key="end">
                                    <div className="timeline-text"></div>
                                    <div className="timeline-center">
                                        <div className="time-line">

                                        </div>
                                        <div className="time-point">
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-xiayiqu"></use>
                                            </svg>
                                        </div>

                                    </div>
                                    <div className="timeline-text"></div>
                                    <div className="timeline-text"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default inject('projectSurveyStore', 'homeStore', 'workStore')(observer(Survey));