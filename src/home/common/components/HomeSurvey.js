/*
 * @Descripttion: 首页概况
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import { getUser } from 'thoughtware-core-ui';
import "./HomePage.scss";
import { Empty, Tabs, Spin } from 'antd';
import { withRouter } from 'react-router';
import WorkStore from '../../../work/store/WorkStore';
import { setSessionStorage } from "../../../common/utils/setSessionStorage"
import setImageUrl from '../../../common/utils/setImageUrl';
import TodoListItem from '../../../common/overviewComponent/TodoListItem';
import WorkItemTrend from './WorkItemTrend';
import ProjectStatusNum from './ProjectStatusNum';
import WorkItemSurvey from './WorkItemSurvey';
const { TabPane } = Tabs;

const HomeSurvey = (props) => {
    const { homeStore } = props
    const { findProjectSortRecentTime, createRecent,
        findTodopage, setActiveKey, findRecentPage, recentList,
        updateRecent, statisticsWorkItemByStatus, endTaskList, todoTaskList
    } = homeStore;
    const tenant = getUser().tenant;
    const { setWorkId, searchWorkById } = WorkStore;
    // 登录者id
    const userId = getUser().userId;
    //最近查看的项目列表
    const [recentProjectList, setRecentProjectList] = useState();
    const [recentLoading, setRecentLoading] = useState(false);
    
    useEffect(() => {
        getRecentProject()
        // 获取待办列表
        findTodopage({
            status: 1, assignUserId: userId, data: {}, pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        },)

        findRecentPage(userId).then(res => {
            console.log(res)
        })

        return;
    }, [])

    /**
     * 获取最近查看的项目列表
     */
    const getRecentProject = () => {
        setRecentLoading(true)
        findProjectSortRecentTime({}).then((res) => {
            if (res.code === 0) {
                setRecentProjectList(res.data)
                setRecentLoading(false)
            }
        });
    }

    /**
     * 跳转到项目详情页面
     * @param {项目信息} project 
     */
    const goProjectDetail = (project) => {
        const params = {
            name: project.projectName,
            model: "project",
            modelId: project.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: project.iconUrl
        }

        // 创建最近访问的信息
        createRecent(params)
        props.history.push(`/projectDetail/${project.id}/workTable`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    };

    /**
     * 跳转到待办列表
     */
    const goTodoWorkItemList = () => {
        props.history.push(`/home/todoList`)
        setActiveKey("todoList")
    }

    /**
     * 跳转到待办详情
     * @param {跳转地址} url 
     */
    const goTodoDetail = (url) => {
        const workItemId = url.split("/")[6];
        searchWorkById(workItemId).then((res) => {
            if (res) {
                setWorkId(workItemId)

                window.location.href = url
                sessionStorage.setItem("menuKey", "work")
            }
        })

    }

    const goProject = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/projectDetail/${item.modelId}/workTable`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    }

    const goWorkItem = (item) => {
        updateRecent({ id: item.id })
        const workItem = item.object;
        setWorkId(workItem.id)
        // 有bug
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.name, iconUrl: workItem.workTypeSys.iconUrl }])
        props.history.push(`/projectDetail/${workItem.project.id}/work/${workItem.id}`)
        sessionStorage.setItem("menuKey", "project")
    }

    const goVersion = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/projectDetail/${item.project.id}/versionDetail/${item.modelId}`)
        sessionStorage.setItem("menuKey", "project")
    }

    const goSprint = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/${item.project.id}/sprintdetail/${item.modelId}/survey`)
        sessionStorage.setItem("menuKey", "project")
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
            case "project":
                element = <div className="project-item" key={item.id}>

                    <div className="project-item-icon">
                        {
                            item?.project?.iconUrl ?
                                <img
                                    src={setImageUrl(item.project.iconUrl)}
                                    alt=""
                                    className="icon-32"
                                />
                                :
                                <img
                                    src={('/images/project1.png')}
                                    alt=""
                                    className="icon-32"
                                />

                        }
                    </div>
                    <div className="project-item-content">
                        <div className="content-name" onClick={() => goProject(item)}>{item.name}</div>
                        <div className="content-type">项目</div>
                    </div>
                    <div className="item-time">
                        {item.recentTime}
                    </div>
                </div>
                break;
            case "workItem":
                element = <div className="work-item" key={item.id}>
                    <div className="work-icon">
                        {
                            item.iconUrl ?
                                <img
                                    src={setImageUrl(item.iconUrl)}
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
                                    className="icon-32"
                                />
                                :
                                <img
                                    src={('/images/version.png')}
                                    alt=""
                                    className="icon-32"
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
                            className="icon-32"
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
    const setWorkNum = (num) => {
        let showNum;
        const isMax = Math.floor(num / 1000);
        if (isMax >= 1) {
            showNum = `${isMax}k+`
        } else {
            showNum = num;
        }
        return showNum;
    }

    const getTodoList = (value) => {
        findTodopage({
            userId: userId, status: value, pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        },)
    }
    return (
        <div className="home-content">
            <div className="recent-project">
                <div className="title">
                    <div className="name">常用项目</div>
                </div>

                <Spin spinning={recentLoading} delay={500} >

                    <div className="home-project">
                        {
                            recentProjectList && recentProjectList.length > 0 ? recentProjectList.map((item, index) => {
                                return <div className="project-item" key={item.id} onClick={() => goProjectDetail(item)}>
                                    <div className="item-title">
                                        {
                                            item.iconUrl ?
                                                <img
                                                    alt=""
                                                    className="icon-32"
                                                    src={setImageUrl(item.iconUrl)}
                                                />
                                                :
                                                <img
                                                    src={('/images/project1.png')}
                                                    alt=""
                                                    className="icon-32"
                                                />

                                        }
                                        <span className="item-name">{item.projectName}</span>
                                    </div>
                                    <div className="item-work">
                                        <div className="process-work">
                                            <span className="work-label" style={{ color: "#999" }}>
                                                待办事项
                                            </span>
                                            <span>
                                                {setWorkNum(item.processWorkItemNumber)}
                                            </span>
                                        </div>
                                        <div className="end-work">
                                            <span className="work-label" style={{ color: "#999" }}>
                                                已完成事项
                                            </span>
                                            <span>
                                                {setWorkNum(item.endWorkItemNumber)}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            })
                                :
                                <Empty image="/images/nodata.png" description="暂时没有可用项目~" />
                        }
                    </div>
                </Spin>
            </div>

            <div className="statistics-box">
                <ProjectStatusNum />
                <WorkItemTrend />
            </div>

            <WorkItemSurvey />
            <div className="todo-work">
                <div className="todo-work-top">
                    <span className="name">待办事项</span>
                    <div>
                        <span className="more" onClick={() => goTodoWorkItemList()}>
                            <svg aria-hidden="true" className="svg-icon">
                                <use xlinkHref="#icon-rightjump"></use>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="todo-work-list">
                    <Tabs defaultActiveKey="1" onChange={(value) => getTodoList(value)}>
                        <TabPane tab="进行中" key="1">
                            {
                                todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                    return <TodoListItem content={item.data} key={item.id} />
                                })
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
                            }
                        </TabPane>
                        <TabPane tab="已完成" key="2">
                            {
                                todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                    return <TodoListItem content={item.data} key={item.id} />
                                })
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
                            }
                        </TabPane>
                        <TabPane tab="已逾期" key="3">
                            {
                                todoTaskList.length > 0 ? todoTaskList.map((item) => {
                                    return <TodoListItem content={item.data} key={item.id} />
                                })
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}


export default withRouter(inject("homeStore")(observer(HomeSurvey)));