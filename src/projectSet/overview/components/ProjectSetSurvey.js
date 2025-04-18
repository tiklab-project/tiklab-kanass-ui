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
import {CloseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import UserIcon from "../../../common/UserIcon/UserIcon";
const ProjectSetSurvey = props => {

    const { logList, findProjectList, createRecent, findProjectSet, updateProjectSet, statisticsProjectSetWorkCount } = BasicInfoStore;
    const projectSetId = props.match.params.projectSetId;
    // const [processProjectList, setProcessProjectList] = useState();
    // const projectSet = JSON.parse(localStorage.getItem("projectSet"));
    const [projectSet, setProjectSet] = useState(JSON.parse(localStorage.getItem("projectSet")) || { projects: [] });
    const [processProjectList, setProcessProjectList] = useState(projectSet.projects || []);

    const status = ["未开始", "进行中", "已结束"]
    // 进度
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        fetchData();
    }, [projectSetId, findProjectList]);

    const fetchData = async () => {
        try {
            const response = await findProjectList({ projectSetId: projectSetId });
            const projectSetResponse = await findProjectSet(projectSetId);
            if (response.code === 0 && Array.isArray(response.data) && projectSetResponse.code === 0) {
                const data = response.data;
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

    // // 项目集进度
    // const percent = 10.36;

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
                                    <div className="projectSet-info-title">创建者</div>
                                    {/*<div className="projectSet-info-result">{projectSet?.master?.name} </div>*/}
                                    <div className="projectSet-info-result">
                                        <Space>
                                            <UserIcon name={projectSet?.master?.nickname} />
                                        {projectSet?.master?.nickname}
                                    </Space></div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">创建时间</div>
                                    <div className="projectSet-info-result">{projectSet?.creatTime} </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">可见范围</div>
                                    <div className="projectSet-info-result">{projectSet?.projectSetLimits === 0 ? "所有人可见" : "成员可见"} </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">项目数量</div>
                                    <div className="projectSet-info-result">
                                        {Array.isArray(projectSet?.projects) ? projectSet.projects.length : 0}
                                    </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划开始日期</div>
                                    <div className="projectSet-info-result">{projectSet?.startTime}</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划结束时间</div>
                                    <div className="projectSet-info-result">{projectSet?.endTime}</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">状态</div>
                                    <div className="projectSet-info-result">

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
                                </div>
                                <div className="projectSet-info-item-progress">
                                    <div className="projectSet-info-item-progress-title">进度</div>
                                    <div className="projectSet-info-item-progress-result">
                                        <Progress percent={percent} status="active" />
                                    </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">预计工时</div>
                                    <div className="projectSet-info-result">
                                        {projectSet?.estimateTime}  小时
                                    </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">剩余工时</div>
                                    <div className="projectSet-info-result">
                                        {projectSet?.surplusTime}  小时
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="projectSet-process-project">
                            <div className="box-title">
                                <span className="name">进行中项目</span>

                                {
                                    processProjectList && processProjectList.length > 4 ?
                                        <Tooltip
                                            title={"更多"}
                                            placement={"top"}
                                        >
                                            <svg aria-hidden="true" className="svg-icon" onClick={() => goProcessProject()} style={{ cursor: "pointer" }}>
                                                <use xlinkHref="#icon-right"></use>
                                            </svg>
                                        </Tooltip>

                                        :
                                        <></>
                                }
                            </div>
                            <div className="projectSet-process-project-list">
                                {
                                    processProjectList && processProjectList.length > 0 ? processProjectList.map((item, index) => {
                                            // 展示前4个，后续点击更多跳转到列表页
                                            if (index < 4){
                                                return <div className="projectSet-process-project-item"
                                                            key={item.id}
                                                            onClick={() => goProdetail(item)}
                                                >
                                                    <div className="projectSet-process-project-left">
                                                        <div>
                                                            <ImgComponent
                                                                src={item.iconUrl}
                                                                className="icon-32"
                                                                title={item.projectName}
                                                                alt=""
                                                            />
                                                        </div>

                                                        <div className="projectSet-process-project-name">

                                                            <div className="projectSet-process-project-date">{item.projectKey}</div>
                                                            <div className="name">{item.projectName}</div>
                                                        </div>
                                                    </div>


                                                    <div className="projectSet-process-project-process">
                                                        {item.master.name}
                                                    </div>
                                                </div>
                                            }
                                        })
                                        :
                                        <ProjectEmpty description="暂时没有动态~" />
                                }
                            </div>
                        </div>
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

