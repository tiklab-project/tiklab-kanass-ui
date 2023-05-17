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
import { getUser } from 'tiklab-core-ui';
import moment from 'moment';
import MyWorkStatistics from "./MyWorkStatistics";
import UserIcon from "../../../common/UserIcon/UserIcon";
import echarts from "../../../common/echarts/echarts"
import { Row, Col, Empty, Progress } from "antd";

const Survey = (props) => {
    // 基于准备好的dom，初始化echarts实例
    const { projectSurveyStore, workStore } = props;
    const { statWorkItemByBusStatus, statProjectManageSprint, findProject,
        findProjectBurnDowmChartPage, findMilestoneList, findlogpage, findtodopage,
        findRecentPage, recentList,updateRecent } = projectSurveyStore;
    const { setWorkId, setDetailCrumbArray, setWorkIndex,setIsWorkList } = workStore;
    //当前用户id
    const masterId = getUser().userId;
    //当前用户名字
    const masterName = getUser().name;
    // 项目id
    const projectId = props.match.params.id;
    // 事项状态列表
    const [workStatusList, setWorkStatusList] = useState();
    // 迭代列表
    const [sprintList, setSprintList] = useState();
    // 项目详情
    const [project, setProject] = useState();
    // 待办列表
    const [todoList, setTodoList] = useState([]);
    // 日志列表
    const [logList, setLogList] = useState([]);
    // 里程碑列表
    const [milestoneList, setMilestoneList] = useState();
    // 进度
    const [percent, setPercent] = useState()
    // 项目类型
    const path = props.match.path.split("/")[2];
    useEffect(() => {
        const data = {
            masterId: masterId,
            projectId: projectId
        }
        // 统计各个状态的事项
        statWorkItemByBusStatus(projectId).then(res => {
            setWorkStatusList(res.data)
            const percent = res.data[3].groupCount / res.data[0].groupCount;
            setPercent(percent ? percent.toFixed(2) : 0)
        })

        // 获取项目详情
        findProject(projectId).then(res => {
            setProject(res.data)
        })

        // 获取日志列表
        findlogpage({ projectId: projectId, currentPage: 1 }).then(res => {
            if (res.code === 0) {
                setLogList(res.data.dataList)
            }
        })

        // 获取待办列表
        findtodopage({ projectId: projectId, currentPage: 1 }).then(res => {
            if (res.code === 0) {
                setTodoList(res.data.dataList)
            }
        })

        // 获取里程碑列表
        findMilestoneList(projectId).then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setMilestoneList(res.data)
            }
        })

        findRecentPage()
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
     * 跳转到待办事项列表
     */
    const goTodoList = () => {
        props.history.push(`/index/${path}/${projectId}/workTodo`)
    }

    /**
    * 跳转到动态列表
    */
    const goDynamicList = () => {
        props.history.push(`/index/${path}/${projectId}/dynamic`)
    }

    /**
     * 跳转到动态所属事项
     * @param {*} url 
     */
    const goOpLogDetail = (url) => {
        window.location.href = url
    }

    /**
    * 跳转到待办事项详情
    * @param {*} url 
    */
    const goTodoDetail = (url) => {
        window.location.href = url
    }

    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (index) => {
        switch (index) {
            case 0:
                goAllWorkItemList();
                break;
            case 1:
                goTodoWorkItemList()
                break;
            case 2:
                goDoneWorkItemList()
                break;
            case 3:
                goProcess();
                break;
            case 4:
                props.history.push({ pathname: `/index/${path}/${projectId}/work/overdue` })
            default:
                break;
        }
    }

    /**
     * 跳转到全部事项列表
     */
    const goAllWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/all`)
    }

    /**
     * 跳转到进行中事项列表
     */
    const goProcess = () => {
        props.history.push({ pathname: `/index/${path}/${projectId}/work/process` })
    }

    /**
     * 跳转到待办事项列表
     */
    const goTodoWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/workTodo`)
    }

    /**
     * 跳转到已完成事项列表
     */
    const goDoneWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/done`)
    }


    const recentItem = (item) => {
        let element;
        switch (item.model) {
            case "workItem":
                element = <div className="work-item" key={item.id}>
                    <div className="work-icon">
                        {
                            item.iconUrl ?
                                <img
                                    src={('/images/' + item.iconUrl)}
                                    alt=""
                                    className="list-img"
                                />
                                :
                                <img
                                    src={('/images/workType1.png')}
                                    alt=""
                                    className="list-img"
                                />

                        }
                    </div>
                    <div className="work-content">
                        <div className="content-name" onClick={() => goWorkItem(item)}>{item.name}</div>
                        <div className="content-type">{item.project.projectName}</div>
                    </div>
                    <div className="item-time">
                        {item.recentTime}
                    </div>
                </div>
                break;
            case "version":
                element = <div className="version-item" key={item.id}>
                    <div className="version-icon">
                        {
                            item.iconUrl ?
                                <img
                                    src={('/images/' + item.iconUrl)}
                                    alt=""
                                    className="list-img"
                                />
                                :
                                <img
                                    src={('/images/version.png')}
                                    alt=""
                                    className="list-img"
                                />

                        }
                    </div>
                    <div className="version-content">
                        <div className="content-name" onClick={() => goVersion(item)}>{item.name}</div>
                        <div className="content-type">{item.project.projectName}</div>
                    </div>
                    <div className="item-time">
                        {item.recentTime}
                    </div>
                </div>
                break;
            case "sprint":
                element = <div className="sprint-item" key={item.id}>
                    <div className="sprint-icon">
                        <img
                            src={('/images/sprint.png')}
                            alt=""
                            className="list-img"
                        />
                    </div>
                    <div className="sprint-content">
                        <div className="content-name" onClick={() => goSprint(item)}>{item.name}</div>
                        <div className="content-type">{item.project.projectName}</div>
                    </div>
                    <div className="item-time">
                        {item.recentTime}
                    </div>
                </div>
                break;
        }
        return element;
    }

    const goProject = (item) => {
        updateRecent({ id: item.id })
        console.log(item)
        if (item.projectType.type === "scrum") {
            props.history.push(`/index/projectScrumDetail/${item.modelId}/survey`)
        }
        if (item.projectType.type === "nomal") {
            props.history.push(`/index/projectNomalDetail/${item.modelId}/survey`)
        }

        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    }

    const goWorkItem = (item) => {
        updateRecent({ id: item.id })
        setWorkId(item.modelId)
        setDetailCrumbArray([{ id: item.modelId, title: item.name, iconUrl: item.iconUrl }])
        setIsWorkList(false)
        if (item.projectType.type === "scrum") {
            props.history.push(`/index/projectScrumDetail/${item.project.id}/work`)
        }
        if (item.projectType.type === "nomal") {
            props.history.push(`/index/projectNomalDetail/${item.project.id}/work`)
        }

    }

    const goVersion = (item) => {
        updateRecent({ id: item.id })
        if (item.projectType.type === "scrum") {
            props.history.push(`/index/projectScrumDetail/${item.project.id}/versionDetail/${item.modelId}`)
        }
        if (item.projectType.type === "nomal") {
            props.history.push(`/index/projectNomalDetail/${item.project.id}/versionDetail/${item.modelId}`)
        }

    }

    const goSprint = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/index/${item.project.id}/sprintdetail/${item.modelId}/survey`)
    }
    return (
        <Row style={{ height: "100%", backgroundColor: "var(--tiklab-gray-600)", overflow: "auto" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-survey">
                    <div className="upper-box">
                        <div className="project-box">
                            <div className="project-title">
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
                                    <UserIcon userInfo={project?.master} size={"big"} className="item-icon" name={masterName} />
                                    <div className="item-content">
                                        <div className="item-top">{project?.master?.nickname}</div>
                                        <div className="item-bottom">项目负责人</div>
                                    </div>
                                </div>
                                <div className="project-work">
                                    <div className="project-item status-item" onClick={() => goWorkItemList(0)}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[0].groupCount}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>
                                    <div className="project-item status-item" onClick={() => goWorkItemList(1)}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-nostart"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[1].groupCount}</div>
                                            <div className="item-bottom">未开始</div>
                                        </div>
                                    </div>
                                    <div className="project-item status-item" onClick={() => goWorkItemList(3)}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[3].groupCount}</div>
                                            <div className="item-bottom">进行中</div>
                                        </div>
                                    </div>
                                    <div className="project-item status-item" onClick={() => goWorkItemList(2)}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[2].groupCount}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>
                                    <div className="project-item status-item" onClick={() => goWorkItemList(4)}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList[4].groupCount}</div>
                                            <div className="item-bottom">已逾期</div>
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
                    <div className="epic-box">
                        <div className="epic-box-title">
                            里程碑
                        </div>
                        <div className="epic-box-timeline">

                            {
                                milestoneList && milestoneList.length > 0 ?
                                    <>
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
                                            milestoneList.map((item, index) => {
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
                                    </>
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有里程碑~" />
                            }

                        </div>
                    </div>
                    <div className="recent-click">
                        <div className="recent-click-title">
                            <span className="name">最近点击</span>
                        </div>
                        <div className="recent-click-list">
                            {
                                recentList && recentList.length > 0 && recentList.map(item => {
                                    return recentItem(item)
                                })
                            }
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
            </Col>
        </Row>
    )
}

export default inject('projectSurveyStore', 'homeStore', 'workStore')(observer(Survey));