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
import { getUser } from 'tiklab-core-ui';
import "./HomePage.scss";
import { Empty, Tabs } from 'antd';
import { withRouter } from 'react-router';
import WorkStore from '../../../work/store/WorkStore';
const { TabPane } = Tabs;

const HomeSurvey = (props) => {
    const { homeStore } = props
    const { statProjectWorkItem, createRecent,
        findTodopage, todoTaskList, setActiveKey, findRecentPage, recentList,
        updateRecent, overdueTaskList, endTaskList
    } = homeStore;
    const tenant = getUser().tenant;
    const { setWorkId, setDetailCrumbArray, searchWorkById, setIsWorkList } = WorkStore;
    // 登录者id
    const userId = getUser().userId;
    //最近查看的项目列表
    const [recentProjectList, setRecentProjectList] = useState();


    useEffect(() => {
        getRecentProject()
        // 获取待办列表
        findTodopage({ userId: userId })

        findRecentPage().then(res => {
            console.log(res)
        })
        return;
    }, [])

    /**
     * 获取最近查看的项目列表
     */
    const getRecentProject = () => {
        statProjectWorkItem(userId).then((res) => {
            if (res.code === 0 && res.data.length > 0) {
                setRecentProjectList(res.data.slice(0, 3))
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
        props.history.push(`/index/projectDetail/${project.id}/survey`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    };

    /**
     * 跳转到待办列表
     */
    const goTodoWorkItemList = () => {
        props.history.push(`/index/home/todoList`)
        setActiveKey("todoList")
    }

    /**
     * 跳转到待办详情
     * @param {跳转地址} url 
     */
    const goTodoDetail = (url) => {
        const workItemId = url.split("/")[6];
        searchWorkById(workItemId).then((res) => {
            console.log(res)
            if (res) {
                setDetailCrumbArray([{ id: workItemId, title: res.title, iconUrl: res.workTypeSys.iconUrl }])
                setWorkId(workItemId)
                setIsWorkList(false)
                
                window.location.href = url
                sessionStorage.setItem("menuKey", "work")
            }
        })
        
    }

    const goProject = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/index/projectDetail/${item.modelId}/survey`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    }

    const goWorkItem = (item) => {
        updateRecent({ id: item.id })
        setWorkId(item.modelId)
        setDetailCrumbArray([{ id: item.modelId, title: item.name, iconUrl: item.iconUrl }])
        setIsWorkList(false)
        props.history.push(`/index/projectDetail/${item.project.id}/workDetail/${item.modelId}`)
        sessionStorage.setItem("menuKey", "project")
    }

    const goVersion = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/index/projectDetail/${item.project.id}/versionDetail/${item.modelId}`)
        sessionStorage.setItem("menuKey", "project")
    }

    const goSprint = (item) => {
        updateRecent({ id: item.id })
        props.history.push(`/index/${item.project.id}/sprintdetail/${item.modelId}/survey`)
        sessionStorage.setItem("menuKey", "project")
    }
    const recentItem = (item) => {
        let element;
        switch (item.model) {
            case "project":
                element = <div className="project-item" key={item.id}>
                    
                    <div className="project-item-icon">
                        {
                            item.iconUrl ?
                                <img
                                    src={version === "cloud" ? (upload_url + item.iconUrl + "?tenant=" + tenant) : (upload_url + item.iconUrl)}
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
                                    src={version === "cloud" ? (upload_url + item.iconUrl + "?tenant=" + tenant) : (upload_url + item.iconUrl)}
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
    return (
        <div className="home-content">
            <div className="recent-project">
                <div className="title">
                    <div className="name">最近项目</div>
                </div>
                <div className="home-project">
                    {
                        recentProjectList && recentProjectList.map((item, index) => {
                            if (index < 4) {
                                return <div className="project-item" key={item.project.id} onClick={() => goProjectDetail(item.project)}>
                                    <div className="item-title">
                                        {
                                            item.project.iconUrl ?
                                                <img
                                                    src={version === "cloud" ? (upload_url + item.project.iconUrl + "?tenant=" + tenant) : (upload_url + item.project.iconUrl)}
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
           
            <div className="recent-click">
                <div className="recent-click-title">
                    <span className="name">我最近查看</span>
                </div>
                <div className="recent-click-list">
                    {
                        recentList && recentList.length > 0 && recentList.map(item => {
                            return recentItem(item)
                        })
                    }
                </div>
            </div>
            <div className="todo-work">
                <div className="todo-work-title">
                    <span className="name">待办任务</span><div>
                        <span className="more" onClick={() => goTodoWorkItemList()}>
                            <svg aria-hidden="true" className="svg-icon">
                                <use xlinkHref="#icon-rightjump"></use>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="todo-work-list">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="进行中" key="todo">
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
                        </TabPane>
                        <TabPane tab="已完成" key="end">
                            {
                                endTaskList.length > 0 ? endTaskList.map((item) => {
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
                        </TabPane>
                        <TabPane tab="已逾期" key="3">
                            {
                                overdueTaskList.length > 0 ? overdueTaskList.map((item) => {
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
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}


export default withRouter(inject("homeStore")(observer(HomeSurvey)));