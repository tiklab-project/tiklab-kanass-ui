/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Form, Empty, Row, Col } from "antd";
import 'moment/locale/zh-cn';
import "../components/ProjectSetSurvey.scss";
import { getUser } from 'tiklab-core-ui';
const ProjectSetSurvey = props => {
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const [form] = Form.useForm();
    const { basicInfoStore, projectSetStore, workStore } = props;
    const { statProjectSetWorkItemProcess, findDynamicPage, findPrecessProjectList, opLogList, findlogpage,
        findtodopage, todoTaskList } = basicInfoStore;
    const { findProjectList } = projectSetStore;
    const [workItemList, setWorkItemList] = useState();
    const projectSetId = props.match.params.projectSetId;
    const [processProjectList, setProcessProjectList] = useState();
    const projectSet = JSON.parse(localStorage.getItem("projectSet"))
    useEffect(() => {
        // info()
        findProjectList().then(res => {
            if (res.code === 0) {
                const list = res.data;
                let ids = []
                if (list.length > 0) {
                    list.map(item => {
                        ids.push(item.id)
                    })
                }
                statProjectSetWorkItemProcess(ids).then(res => {
                    if (res.code === 0) {
                        setWorkItemList(res.data.slice(0, 6))
                    }
                })
                const dynamicValue = {
                    projectIds: ids,
                    pageSize: 5
                }
                // findDynamicPage(dynamicValue).then(res => {
                //     if (res.code === 0) {
                //         setDynamicList(res.data.dataList)
                //     }
                // })
            }
        })
        findPrecessProjectList({ projectSetId: projectSetId, projectState: "2" }).then(res => {
            if (res.code === 0) {
                setProcessProjectList(res.data)
            }
        })

        findtodopage({ userId: getUser().id })
        findlogpage()
        // statProjectSetWorkItemProcess(["1350d500c60d2dfa78608ce0813bc64a", "edcf0a272504f4b5217731661aaf1a47"])
        return;
    }, [])

    const goTodoWorkItemList = () => {
        props.history.push(`/index/work/worklist/process`)
    }

    const goProcessProject = () => {
        props.history.push(`/index/projectSetdetail/${projectSetId}/dynamic`)
    }

    const goProdetail = (project) => {
        localStorage.setItem("project", JSON.stringify(project));
        localStorage.setItem("projectId", project.id);
        localStorage.setItem("projectTypeId", project.projectType.id);
      

        props.history.push(`/index/projectScrumDetail/${project.id}/survey`)
    };

    const goOpLogDetail = (url) => {
        window.location.href = url
    }
    const goTodoDetail = (url) => {
        window.location.href = url
    }


    return (
        <Row className="projectSet-survey">
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div>
                    <div className="projectSet-survey-top">
                        <div className="survey-top-left">
                            <div className="projectSet-info">
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-program"></use>
                                </svg>
                                <div className="projectSet-info-content">
                                    <div className="projectSet-info-content-item">
                                        {projectSet.name}
                                    </div>
                                    <div className="projectSet-info-content-item">
                                        {projectSet.master?.name} 创建于 {projectSet.startTime}
                                    </div>
                                </div>

                                {/* <div className="projectSet-info-action">
                            <div>
                                收藏
                            </div>
                        </div> */}
                            </div>
                            <div className="projectSet-infobottom">
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">可见范围</div>
                                    <div className="projectSet-info-result">所有人可见</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">项目数量</div>
                                    <div className="projectSet-info-result">所有人可见</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划开始日期</div>
                                    <div className="projectSet-info-result">2022-07-28</div>
                                </div>
                                <div className="projectSet-info-item">
                                    <div className="projectSet-info-title">计划结束时间</div>
                                    <div className="projectSet-info-result">2022-07-28</div>
                                </div>
                            </div>
                        </div>
                        <div className="projectSet-process-project">
                            <div className="projectSet-process-project-title">
                                <span className="name">进行中项目</span>
                                <span className="more" onClick={() => goProcessProject()}>更多...</span>
                            </div>
                            <div className="projectSet-process-project-list">
                                {
                                    processProjectList && processProjectList.length > 0 ? processProjectList.map(item => {
                                        return <div className="projectSet-process-project-item"
                                            key={item.id}
                                            onClick={() => goProdetail(item)}
                                        >
                                            <div className="projectSet-process-project-left">
                                                <svg className="menu-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-zuoyepiaotiaoyue"></use>
                                                </svg>
                                                <div className="projectSet-process-project-name">
                                                    <div className="name">{item.projectName}</div>
                                                    <div className="projectSet-process-project-date">{item.endTime}</div>
                                                </div>
                                            </div>

                                            <div className="projectSet-process-project-project">
                                                {item.projectType.name}
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
                    <div className="projectSet-survey-middle">
                        <div className="projectSet-pending-workitem">
                            <div className="projectSet-pending-workitem-title">
                                <span className="name">待办事项</span>
                                {
                                    todoTaskList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectSetdetail/${projectSetId}/workTodo`) }}>
                                        <svg aria-hidden="true" className="svg-icon">
                                            <use xlinkHref="#icon-rightjump"></use>
                                        </svg>
                                    </div>
                                }

                            </div>
                            <div className="projectSet-pending-workitem-list">
                                {
                                    todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                        return <div
                                            dangerouslySetInnerHTML={{ __html: item.data }}
                                            className="dynamic-item"
                                            onClick={() => goTodoDetail(item.link)}
                                        />
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="暂时没有待办~" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="projectSet-survey-middle">
                        <div className="projectSet-sprint-box" >
                            <div className="dynamic-box">
                                <div className="dynamic-box-title">
                                    <span className="name">相关动态</span>
                                    {
                                        opLogList.length > 20 && <div className="more" onClick={() => { props.history.push(`/index/projectSetdetail/${projectSetId}/dynamic`) }}>
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
                                            />
                                        })
                                            :
                                            <Empty image="/images/nodata.png" description="暂时没有动态~" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default inject('basicInfoStore', 'projectSetStore', 'workStore')(observer(ProjectSetSurvey));
