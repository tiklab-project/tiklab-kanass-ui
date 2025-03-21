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
import { Empty, Row, Col } from "antd";
import 'moment/locale/zh-cn';
import "../components/ProjectSetSurvey.scss";
import BasicInfoStore from "../store/BasicInfoStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoStatistics from "../../../home/common/components/TodoStatistics";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const ProjectSetSurvey = props => {

    const { logList, findProjectList, createRecent } = BasicInfoStore;
    const projectSetId = props.match.params.projectSetId;
    // const [processProjectList, setProcessProjectList] = useState();
    // const projectSet = JSON.parse(localStorage.getItem("projectSet"));
    const [projectSet, setProjectSet] = useState(JSON.parse(localStorage.getItem("projectSet")) || { projects: [] });
    const [processProjectList, setProcessProjectList] = useState(projectSet.projects || []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await findProjectList({ projectSetId: projectSetId });
                if (response.code === 0 && Array.isArray(response.data)) {
                    const data = response.data;
                    const projectSetData = {
                        projects: data,
                        name: data[0]?.projectName || "未命名项目集",
                        color: data[0]?.color || "#4CAF50",
                        startTime: data[0]?.startTime,
                        endTime: data[0]?.endTime,
                        master: data[0]?.master,
                        projectSetLimits: data[0]?.projectSetLimits
                    };
                    localStorage.setItem("projectSet", JSON.stringify(projectSetData));
                    setProjectSet(projectSetData);
                    setProcessProjectList(data.filter(project => project.projectState === "1")); // 筛选进行中的项目
                } else {
                    console.error("项目集数据获取失败:", response.msg || response.detailMsg);
                }
            } catch (error) {
                console.error("获取项目集数据时出错:", error);
            }
        };

        fetchData();
    }, [projectSetId, findProjectList]);

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

    return (
        <Row className="projectSet-survey">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div>
                    <div className="projectSet-survey-top">
                        <div className="survey-top-left">
                            <div className="projectSet-info">
                                {/*<ColorIcon color = {projectSet.color} name = {projectSet.name} className = "projectSet-icon"/>*/}
                                <div className="projectSet-info-content">
                                    <div className="projectSet-info-content-item box-title">
                                        {projectSet?.name}
                                    </div>
                                    <div className="projectSet-info-content-item">
                                        {projectSet?.master?.name} 创建于 {projectSet?.startTime}
                                    </div>
                                </div>
                            </div>
                            <div className="projectSet-infobottom">
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">可见范围</div>
                                    <div className="projectSet-info-result">{projectSet?.projectSetLimits === 0 ? "所有人可见" : "成员可见"} </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">项目数量</div>
                                    <div className="projectSet-info-result">
                                        {Array.isArray(projectSet?.projects) ? projectSet.projects.length : 0}
                                    </div>
                                    {/*<div className="projectSet-info-result">0</div>*/}
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划开始日期</div>
                                    <div className="projectSet-info-result">{projectSet?.startTime}</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划结束时间</div>
                                    <div className="projectSet-info-result">{projectSet?.endTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className="projectSet-process-project">
                            <div className="box-title">
                                <span className="name">进行中项目</span>
                                {/* <svg aria-hidden="true" className="svg-icon" onClick={() => goProcessProject()}>
                                    <use xlinkHref="#icon-rightjump"></use>
                                </svg> */}
                            </div>
                            <div className="projectSet-process-project-list">
                                {
                                    processProjectList && processProjectList.length > 0 ? processProjectList.map(item => {
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

