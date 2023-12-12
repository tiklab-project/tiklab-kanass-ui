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
import setImageUrl from "../../../common/utils/setImageUrl";
import DyncmicList from "../../../common/overviewComponent/DynamicList";
const Survey = (props) => {
    const { statWorkItemByBusStatus, findProject,
        findProjectBurnDowmChartPage, findMilestoneList, findlogpage, findtodopage,
        findRecentPage, recentList, updateRecent } = ProjectSurveyStore;
    const { setWorkId, setSearchType } = Workstore;
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
    const [logList, setLogList] = useState([]);
    // 里程碑列表
    const [milestoneList, setMilestoneList] = useState();
    // 进度
    const [percent, setPercent] = useState()
    // 项目类型
    const tenant = getUser().tenant;
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
        props.history.push(`/projectDetail/${projectId}/dynamic`)
    }

    /**
     * 跳转到动态所属事项
     * @param {*} url 
     */
    const goOpLogDetail = (url) => {
        window.location.href = url
    }


    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (value) => {
        setSearchType(value)
        props.history.push(`/projectDetail/${projectId}/workTable`)
    }


    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
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
                                    alt=""
                                    className="list-img"
                                    src={setImageUrl(item.iconUrl)}
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


    const goWorkItem = (item) => {
        updateRecent({ id: item.id })
        setWorkId(item.modelId)
        setSessionStorage("detailCrumbArray", [{ id: item.modelId, title: item.object.name, iconUrl: item.object.workTypeSys.iconUrl }])

        props.history.push(`/projectDetail/${item.object.project.id}/work/${item.object.id}`)
    }

    const goVersion = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/projectDetail/${item.project.id}/versionDetail/${item.modelId}`)

    }

    const goSprint = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/${item.project.id}/sprintdetail/${item.modelId}/survey`)
    }
    return (
        <Row style={{ height: "100%", overflow: "auto", background: "var(--thoughtware-gray-600)" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-survey">
                    <div className="upper-box">
                        <div className="project-box">
                            <div className="box-title">
                                <span>
                                    {
                                        project?.iconUrl ?
                                            <img
                                                alt=""
                                                className="list-img"
                                                src={setImageUrl(project.iconUrl)}
                                            />
                                            :
                                            <img
                                                src={('/images/project1.png')}
                                                alt=""
                                                className="list-img"
                                            />

                                    }
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
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.all}</div>
                                            <div className="item-bottom">全部事项</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("pending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.pending}</div>
                                            <div className="item-bottom">待办</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("ending")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.ending}</div>
                                            <div className="item-bottom">已完成</div>
                                        </div>
                                    </div>

                                    <div className="project-item status-item" onClick={() => goWorkItemList("overdue")}>
                                        <svg className="status-img" aria-hidden="true">
                                            <use xlinkHref="#icon-overdue"></use>
                                        </svg>
                                        <div className="item-content">
                                            <div className="item-top">{workStatusList && workStatusList.overdue}</div>
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
                                    <Empty image="/images/nodata.png" description="暂时没有里程碑~" />
                            }

                        </div>
                    </div>
                    <div className="recent-click">
                        <div className="box-title">
                            <span className="name">常用事项</span>
                        </div>
                        <div className="recent-click-list">
                            {
                                recentList && recentList.length > 0 ? recentList.map(item => {
                                    return <div className="work-item" key={item.object.id}>
                                        <div className="work-left">
                                            <div className="work-icon">
                                                {
                                                    item.object.workTypeSys.iconUrl ?
                                                        <img
                                                            src={setImageUrl(item.object.workTypeSys.iconUrl)}
                                                            alt=""
                                                            className="icon-32"
                                                        />
                                                        :
                                                        <img
                                                            src={('/images/workType1.png')}
                                                            alt=""
                                                            className="icon-32"
                                                        />

                                                }
                                            </div>
                                            <div className="work-content">
                                                <div className="content-name" onClick={() => goWorkItem(item)}>{item.object.title}</div>
                                                <div className="content-type">{item.object.id}</div>
                                            </div>
                                        </div>
                                        <div style={{width: "100px"}}>
                                            <div className={`work-status ${setStatuStyle(item.object.workStatusNode.id)}`}>
                                                {item.object.workStatusNode.name}
                                            </div>
                                        </div>

                                        <div className="work-time">
                                            {item.recentTime}
                                        </div>
                                    </div>
                                })
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有点击过事项~" />
                            }
                        </div>
                    </div>
                    <DyncmicList logList = {logList} goDynamicList = {goDynamicList} goOpLogDetail = {goOpLogDetail} />
                    {/* <div className="dynamic-box">
                        <div className="box-title">
                            <div className="name">相关动态</div>
                            <div className="more" onClick={() => goDynamicList()}>
                                <svg aria-hidden="true" className="svg-icon">
                                    <use xlinkHref="#icon-rightjump"></use>
                                </svg>
                            </div>
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
                    </div> */}

                </div>
            </Col>
        </Row>
    )
}

export default observer(Survey);