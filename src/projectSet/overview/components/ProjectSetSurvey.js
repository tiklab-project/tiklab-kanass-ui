/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Empty, Row, Col } from "antd";
import 'moment/locale/zh-cn';
import "../components/ProjectSetSurvey.scss";
import { getUser } from 'thoughtware-core-ui';
import BasicInfoStore from "../store/BasicInfoStore";
import DynamicList from "../../../common/overviewComponent/DynamicList";
import TodoListBox from "../../../common/overviewComponent/TodoListBox";
import setImageUrl from "../../../common/utils/setImageUrl";
import TodoStatistics from "../../../home/common/components/TodoStatistics";
const ProjectSetSurvey = props => {

    const { findlogpage, findtodopage, findProjectList, createRecent } = BasicInfoStore;
    const projectSetId = props.match.params.projectSetId;
    const [processProjectList, setProcessProjectList] = useState();
    const projectSet = JSON.parse(localStorage.getItem("projectSet"));
    const [todoTaskList, setTodoTaskList] = useState([])
    const [logList, setLogList] = useState([])
    useEffect(() => {
        findProjectList({ projectSetId: projectSetId }).then(res => {
            if (res.code === 0) {
                const list = res.data;
                let ids = []
                let todo = []
                if (list.length > 0) {
                    list.map(item => {
                        ids.push(item.id)
                        findtodopage({ projectId: item.id }).then(res => {
                            if (res.code === 0) {
                                todoTaskList.push(...res.data.dataList)
                                setTodoTaskList([...todoTaskList])
                            }
                        })
                        findlogpage({ projectId: item.id }).then(res => {
                            if (res.code === 0) {
                                logList.push(...res.data.dataList)
                                setLogList([...logList])
                            }
                        })
                    })
                    setProcessProjectList(list.filter(item => item.projectState === "2"))
                }
            }
        })

        return;
    }, [])


    const goProcessProject = () => {
        props.history.push(`/projectSetdetail/${projectSetId}/dynamic`)
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

        props.history.push(`/projectDetail/${project.id}/workTable`)
    };

    const goOpLogDetail = (url) => {
        window.location.href = url
    }
    const goTodoDetail = (url) => {
        window.location.href = url
    }
    const goDynamicList = () => {
        props.history.push(`/projectSetdetail/${projectSetId}/dynamic`)

    }
    const goToListPage = () => {
        props.history.push(`/projectSetdetail/${projectSetId}/workTodo`)
    }
    return (
        <Row className="projectSet-survey">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div>
                    <div className="projectSet-survey-top">
                        <div className="survey-top-left">
                            <div className="projectSet-info">
                                <div className={`projectSet-icon projectSet-color-${projectSet.color}`}>{projectSet.name?.slice(0, 1)}</div>
                                <div className="projectSet-info-content">
                                    <div className="projectSet-info-content-item box-title">
                                        {projectSet.name}
                                    </div>
                                    <div className="projectSet-info-content-item">
                                        {projectSet.master?.name} 创建于 {projectSet.startTime}
                                    </div>
                                </div>
                            </div>
                            <div className="projectSet-infobottom">
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">可见范围</div>
                                    <div className="projectSet-info-result">{projectSet.projectSetLimits === 0 ? "所有人可见" : "成员可见"} </div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">项目数量</div>
                                    <div className="projectSet-info-result">0</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划开始日期</div>
                                    <div className="projectSet-info-result">{projectSet.startTime}</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划结束时间</div>
                                    <div className="projectSet-info-result">{projectSet.endTime}</div>
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
                                                    <img
                                                        src={setImageUrl(item.iconUrl)}
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
                                        <Empty image="/images/nodata.png" description="暂时没有动态~" />
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
