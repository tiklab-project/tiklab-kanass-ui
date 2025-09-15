/*
 * @Descripttion: 项目集概况
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:01:29
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer } from "mobx-react";
import {Empty, Row, Col, Tooltip, Select, Progress, Space} from "antd";
import 'moment/locale/zh-cn';
import "../components/ProjectSetSurvey.scss";
import BasicInfoStore from "../store/BasicInfoStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoStatistics from "../../../home/common/components/TodoStatistics";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import {ClockCircleOutlined, CloseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import UserIcon from "../../../common/UserIcon/UserIcon";
import projectList from "../../../project/project/components/ProjectList";
import moment from "moment";
import echarts from "../../../common/echarts/echarts";
const ProjectSetSurvey = props => {

    const { logList, findProjectList, createRecent, findProjectSet, updateProjectSet, statisticsProjectSetWorkCount, findProjectSetBurnDowmChartPage } = BasicInfoStore;
    const projectSetId = props.match.params.projectSetId;
    // const [processProjectList, setProcessProjectList] = useState();
    // const projectSet = JSON.parse(localStorage.getItem("projectSet"));
    const [projectSet, setProjectSet] = useState(JSON.parse(localStorage.getItem("projectSet")) || { projects: [] });
    const [processProjectList, setProcessProjectList] = useState(projectSet.projects || []);
    const [projectList, setProjectList] = useState([]);

    const status = ["未开始", "进行中", "已结束"]
    // 进度
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        fetchData();
        // 获取项目燃尽图列表
        findProjectSetBurnDowmChartPage(projectSetId).then(res => {
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
                    Yaxis.push(projectSet.worklItemNumber);
                    workCountYaixs.push(projectSet.worklItemNumber);
                    let i = 1;
                    for (i = 1; i <= 6; i++) {
                        timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                        workCountYaixs.push(projectSet.worklItemNumber);
                        Yaxis.push(projectSet.worklItemNumber * (7 - i) / 7);
                    }
                }
                burnDownChart(timerXaixs, workCountYaixs, Yaxis)
            }
        })
    }, [projectSetId, findProjectList]);

    const fetchData = async () => {
        try {
            const response = await findProjectList({ projectSetId: projectSetId });
            const projectSetResponse = await findProjectSet(projectSetId);
            if (response.code === 0 && Array.isArray(response.data) && projectSetResponse.code === 0) {
                const data = response.data;
                setProjectList(data)
                let estimateTime = 0;
                let surplusTime = 0;
                for (const project of data) {
                    estimateTime = estimateTime + project.estimateTime;
                    surplusTime = surplusTime + project.surplusTime;
                }
                const projectSetData = {
                    projects: data,
                    name: projectSetResponse.data.name || "未命名项目集",
                    color: projectSetResponse.data.color || "#4CAF50",
                    startTime: projectSetResponse.data.startTime,
                    endTime: projectSetResponse.data.endTime,
                    master: projectSetResponse.data.master,
                    projectSetLimits: projectSetResponse.data.projectSetLimits,
                    creatTime: projectSetResponse?.data?.creatTime === null ? "--" : projectSetResponse?.data?.creatTime.substring(0, 10),
                    status: projectSetResponse?.data?.status || "0",
                    estimateTime: estimateTime,
                    surplusTime: surplusTime,
                };
                localStorage.setItem("projectSet", JSON.stringify(projectSetData));
                setProjectSet(projectSetData);
                setProcessProjectList(data.filter(project => project.projectState === "2")); // 筛选进行中的项目  1未开始 2进行中 3已结束
                console.log(JSON.stringify(processProjectList));
                statisticsProjectSetWorkCount({ projectSetId: projectSetId }).then(res => {
                    const percent = res.data.end / res.data.total * 100;
                    setPercent(percent ? percent.toFixed(2) : 0)
                    // console.log("事项个数：   "+JSON.stringify(res.data))
                })
            } else {
                console.error("项目集数据获取失败:", response.msg || response.detailMsg);
            }
        } catch (error) {
            console.error("获取项目集数据时出错:", error);
        }
    };

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

    const goProdetail = (project) => {
        localStorage.setItem("project", JSON.stringify(project));
        const params = {
            name: project.projectName,
            model: "project",
            modelId: project.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: project.iconUrl
        }
        createRecent(params)

        props.history.push(`/project/${project.id}/workitem`)
    };

    const goOpLogDetail = (url) => {
        window.location.href = url
    }

    const goDynamicList = () => {
        props.history.push(`/projectSet/${projectSetId}/dynamic`)

    }

    const goProcessProject = () => {
        props.history.push(`/projectSet/${projectSetId}/project`)
    }

    const handleChange = (value) => {
        const params = {
            id: projectSetId,
            status: value
        };
        updateProjectSet(params).then(res => {
            fetchData();
        })
    }

    const getProjectListCount = (status) => {
        if (status === "0"){
            return projectList.length
        }else {
            return projectList.filter(project => project.projectState === status).length
        }
    }

    const goProjectList = (value) => {
        // props.history.push(`/projectSet/${projectSetId}/project/${value}`)
    }

    return (
        <Row className="projectSet-survey">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div>
                    <div className="projectSet-survey-top">
                        <div className="survey-top-left">
                            <div className="projectSet-info">
                                <div className="projectSet-info-content">
                                    <ColorIcon color = {projectSet.color} name = {projectSet.name} className = "projectSet-icon"/>
                                    <div className="projectSet-info-content-item box-title">
                                        {projectSet?.name}
                                    </div>
                                    {/*<div className="projectSet-info-content-item">*/}
                                    {/*    {projectSet?.master?.name} 创建于 {projectSet?.creatTime}*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div className="projectSet-info-bottom">
                                <div className="projectSet-info-item">
                                    <UserIcon name={projectSet?.master?.nickname} size={"big"}/>
                                    <div className="info-item-content">
                                        <div className="content-top">
                                            {projectSet?.master?.nickname}
                                        </div>
                                        <div className="content-bottom">创建者</div>
                                    </div>
                                </div>
                                <div className="project-status">
                                    <div className="projectSet-info-item status-item" onClick={() => goProjectList("0")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-allwork"></use>
                                        </svg>
                                        <div className="info-item-content">
                                            <div className="content-top">{getProjectListCount("0")}</div>
                                            <div className="content-bottom">项目</div>
                                        </div>
                                    </div>

                                    <div className="projectSet-info-item status-item" onClick={() => goProjectList("1")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-not-start"></use>
                                        </svg>
                                        <div className="info-item-content">
                                            <div className="content-top">{getProjectListCount("1")}</div>
                                            <div className="content-bottom">未开始</div>
                                        </div>
                                    </div>

                                    <div className="projectSet-info-item status-item" onClick={() => goProjectList("2")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-progress"></use>
                                        </svg>
                                        <div className="info-item-content">
                                            <div className="content-top">{getProjectListCount("2")}</div>
                                            <div className="content-bottom">进行中</div>
                                        </div>
                                    </div>

                                    <div className="projectSet-info-item status-item" onClick={() => goProjectList("3")}>
                                        <svg className="list-img" aria-hidden="true">
                                            <use xlinkHref="#icon-endwork"></use>
                                        </svg>
                                        <div className="info-item-content">
                                            <div className="content-top">{getProjectListCount("3")}</div>
                                            <div className="content-bottom">已完成</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-status"></use>
                                    </svg>
                                    <div className="info-item-content">
                                        <div className="content-top">
                                            <Select
                                                className={`projectSet-status-select projectSet-status-select${projectSet?.status === "0" ? "-todo" : projectSet?.status === "1" ? "-process" : "-done"}`}
                                                defaultValue={"--"}
                                                dropdownMatchSelectWidth={false}
                                                value={status[projectSet?.status || 0]}
                                                bordered={false}
                                                showArrow={false}
                                                // disabled={project?.projectState === "3" ? true : false}
                                                onChange={handleChange}
                                            >
                                                {
                                                    projectSet?.status === "0" ?
                                                        <Select.Option value="1">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <PlayCircleOutlined />
                                                                </span>
                                                            开始项目集
                                                        </Select.Option>
                                                        : projectSet?.status === "1" ?
                                                            <Select.Option value="2">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <CloseCircleOutlined />
                                                                </span>
                                                                结束项目集
                                                            </Select.Option> :
                                                            <Select.Option value="1">
                                                                <span style={{paddingRight:"10px"}}>
                                                                    <PlayCircleOutlined />
                                                                </span>
                                                                开始项目集
                                                            </Select.Option>
                                                }
                                            </Select>
                                        </div>
                                        <div className="content-bottom">状态</div>
                                    </div>
                                </div>
                                {/*<div className="projectSet-info-item">*/}
                                {/*    <div className="projectSet-info-title">创建时间</div>*/}
                                {/*    <div className="projectSet-info-result">{projectSet?.creatTime} </div>*/}
                                {/*</div>*/}
                                {/*<div className="projectSet-info-item">*/}
                                {/*    <div className="projectSet-info-title">可见范围</div>*/}
                                {/*    <div className="projectSet-info-result">{projectSet?.projectSetLimits === 0 ? "所有人可见" : "成员可见"} </div>*/}
                                {/*</div>*/}
                                {/*<div className="projectSet-info-item">*/}
                                {/*    <div className="projectSet-info-title">项目数量</div>*/}
                                {/*    <div className="projectSet-info-result">*/}
                                {/*        {Array.isArray(projectSet?.projects) ? projectSet.projects.length : 0}*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="projectSet-info-item">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-date"></use>
                                    </svg>
                                    <div className="info-item-content">
                                        <div className="content-top">{projectSet?.startTime} ~ {projectSet?.endTime}</div>
                                        <div className="content-bottom">计划时间</div>
                                    </div>
                                </div>
                                {/*<div className="projectSet-info-item">*/}
                                {/*    <div className="projectSet-info-title">计划结束时间</div>*/}
                                {/*    <div className="projectSet-info-result">{projectSet?.endTime}</div>*/}
                                {/*</div>*/}

                                <div className="projectSet-info-item projectSet-info-item-progress">
                                    <svg className="list-img" aria-hidden="true">
                                        <use xlinkHref="#icon-rate"></use>
                                    </svg>
                                    <div className="info-item-content">
                                        <div className="content-top projectSet-info-item-progress-result">
                                            <Progress percent={percent} status="active" />
                                        </div>
                                        <div className="content-bottom">进度</div>
                                    </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="item-group">
                                        <ClockCircleOutlined style={{fontSize:"20px", color:"grey"}} />
                                        <div className="info-item-content">
                                            <div className="content-top">
                                                {projectSet?.estimateTime}  小时
                                            </div>
                                            <div className="content-bottom">预计工时</div>
                                        </div>
                                    </div>

                                    <div className="item-group">
                                        <ClockCircleOutlined style={{fontSize:"20px", color:"grey"}} />
                                        <div className="info-item-content">
                                            <div className="content-top">
                                                {projectSet?.surplusTime}  小时
                                            </div>
                                            <div className="content-bottom">剩余工时</div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="projectSet-info-item">*/}
                                {/*    <div className="projectSet-info-title">剩余工时</div>*/}
                                {/*    <div className="projectSet-info-result">*/}
                                {/*        {projectSet?.surplusTime}  小时*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="burn-down-box">
                            <div className="box-title">项目集燃尽图</div>
                            <div className="burn-down" id="burn-down">

                            </div>
                        </div>
                        {/*<div className="projectSet-process-project">*/}
                        {/*    <div className="box-title">*/}
                        {/*        <span className="name">进行中项目</span>*/}

                        {/*        {*/}
                        {/*            processProjectList && processProjectList.length > 4 ?*/}
                        {/*                <Tooltip*/}
                        {/*                    title={"更多"}*/}
                        {/*                    placement={"top"}*/}
                        {/*                >*/}
                        {/*                    <svg aria-hidden="true" className="svg-icon" onClick={() => goProcessProject()} style={{ cursor: "pointer" }}>*/}
                        {/*                        <use xlinkHref="#icon-right"></use>*/}
                        {/*                    </svg>*/}
                        {/*                </Tooltip>*/}

                        {/*                :*/}
                        {/*                <></>*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*    <div className="projectSet-process-project-list">*/}
                        {/*        {*/}
                        {/*            processProjectList && processProjectList.length > 0 ? processProjectList.map((item, index) => {*/}
                        {/*                    // 展示前4个，后续点击更多跳转到列表页*/}
                        {/*                    if (index < 4){*/}
                        {/*                        return <div className="projectSet-process-project-item"*/}
                        {/*                                    key={item.id}*/}
                        {/*                                    onClick={() => goProdetail(item)}*/}
                        {/*                        >*/}
                        {/*                            <div className="projectSet-process-project-left">*/}
                        {/*                                <div>*/}
                        {/*                                    <ImgComponent*/}
                        {/*                                        src={item.iconUrl}*/}
                        {/*                                        className="icon-32"*/}
                        {/*                                        title={item.projectName}*/}
                        {/*                                        alt=""*/}
                        {/*                                    />*/}
                        {/*                                </div>*/}

                        {/*                                <div className="projectSet-process-project-name">*/}

                        {/*                                    <div className="projectSet-process-project-date">{item.projectKey}</div>*/}
                        {/*                                    <div className="name">{item.projectName}</div>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}


                        {/*                            <div className="projectSet-process-project-process">*/}
                        {/*                                {item.master.name}*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*                :*/}
                        {/*                <ProjectEmpty description="暂时没有动态~" />*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    {/* <TodoListBox todoTaskList={todoTaskList} goToListPage={goToListPage} model={"projectSet"} /> */}
                    <TodoStatistics />
                    <DynamicList logList={logList} goDynamicList={goDynamicList} goOpLogDetail={goOpLogDetail} />
                </div>
            </Col>
        </Row>
    )
}

export default observer(ProjectSetSurvey);

