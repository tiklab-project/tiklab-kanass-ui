/*
 * @Descripttion: 首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { Fragment, useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import { getUser } from 'tiklab-core-ui';
import "./HomePage.scss";
import MyWorkStatistics from "./MyWorkStatistics";
import { Empty } from 'antd';
import { withRouter } from 'react-router';

const HomeSurvey = (props) => {
    const { homeStore, workStore, route } = props
    const { statProjectWorkItem, manageSprint, createRecent, opLogList, findLogpage,
        findTodopage, todoTaskList, statWorkItemByBusStatus, setActiveKey
    } = homeStore;
    const userId = getUser().userId;
    const [projectList, setProjectList] = useState();


    useEffect(() => {
        statProjectWorkItem(userId).then((res) => {
            if (res.code === 0 && res.data.length > 0) {
                setProjectList(res.data.slice(0, 3))
            }
        });
        findTodopage({ userId: userId })
        getDynamicList(1)
        return;
    }, [])

    const getDynamicList = (currentPage) => {
        const value = {
            currentPage: currentPage
        }
        findLogpage({ userId: userId })
    }

    const goProdetail = (project) => {
        // localStorage.setItem("project", JSON.stringify(project));
        // localStorage.setItem("projectId", project.id);
        // localStorage.setItem("projectTypeId", project.projectType.id);
        const params = {
            name: project.projectName,
            model: "project",
            modelId: project.id,
            projectId: project.id
        }
        createRecent(params)
        if (project.projectType.type === "scrum") {
            props.history.push(`/index/projectScrumDetail/${project.id}/survey`)
        }
        if (project.projectType.type === "nomal") {
            props.history.push(`/index/projectNomalDetail/${project.id}/survey`)
        }
        sessionStorage.setItem("menuKey", "project")
    };

    const goTodoWorkItemList = () => {
        props.history.push(`/index/home/todoList`)
        // sessionStorage.setItem("menuKey", "work")
        setActiveKey("todoList")
    }


    const goOpLogDetail = (url) => {
        window.location.href = url
    }
    const goTodoDetail = (url) => {
        window.location.href = url
    }

    return (
        <div className="home-content">
            <div className="upper-box">
                <div className="title">
                    <div className="name">最近项目</div>
                    {/* {
                        projectList && projectList.length > 4 && <div className="more">
                            <svg aria-hidden="true" className="svg-icon">
                                <use xlinkHref="#icon-rightjump"></use>
                            </svg>
                        </div>
                    } */}
                </div>
                <div className="home-project">
                    {
                        projectList && projectList.map((item, index) => {
                            if (index < 4) {
                                return <div className="project-item" key={item.project.id} onClick={() => goProdetail(item.project)}>
                                    <div className="item-title">
                                        {
                                            item.project.iconUrl ?
                                                <img
                                                    src={('/images/' + item.project.iconUrl)}
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
                                        <span>{item.project.projectName}</span>
                                    </div>
                                    <div className="item-work">
                                        <div className="process-work"><span style={{ color: "#999" }}>未处理的事务</span><span>{item.processWorkItemCount}</span></div>
                                        <div className="end-work"><span style={{ color: "#999" }}>已处理事务</span><span>{item.endWorkItemCount}</span></div>
                                    </div>

                                </div>
                            }

                        })
                    }
                </div>
            </div>
            <div className="center-box">
                <MyWorkStatistics {...props} statWorkItemByBusStatus={statWorkItemByBusStatus} />
            </div>
            <div className="center-box">
                <div className="pending-workitem">
                    <div className="pending-workitem-title">
                        <span className="name">待办任务</span><div>
                            <span className="more" onClick={() => goTodoWorkItemList()}>
                                <svg aria-hidden="true" className="svg-icon">
                                    <use xlinkHref="#icon-rightjump"></use>
                                </svg>
                            </span>
                        </div>

                    </div>
                    <div className="pending-workitem-list">
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
            </div>
            <div className="foot-box">
                <div className="dynamic-box">
                    <div className="dynamic-box-title">
                        <span className="name">相关动态</span>
                        <div className="more" onClick={() => { props.history.push(`/index/dynamic`) }}>
                            <svg aria-hidden="true" className="svg-icon">
                                <use xlinkHref="#icon-rightjump"></use>
                            </svg>
                        </div>
                    </div>
                    <div className="dynamic-list">
                        {
                            opLogList.length > 0 ? opLogList.map(item => {
                                return <div
                                    dangerouslySetInnerHTML={{ __html: item.data }}
                                    className="dynamic-item"
                                    key={item.id}
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
    );
}


export default withRouter(inject("homeStore", "workStore")(observer(HomeSurvey)));