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
import WorkItemTrend from './WorkItemTrend';
import ProjectStatusNum from './ProjectStatusNum';
import WorkItemSurvey from './WorkItemSurvey';
import TodoStatistics from './TodoStatistics';
import ImgComponent from '../../../common/imgComponent/ImgComponent';
import ProjectEmpty from '../../../common/component/ProjectEmpty';
const { TabPane } = Tabs;

const HomeSurvey = (props) => {
    const { homeStore } = props
    const { findProjectSortRecentTime, createRecent,
        findTodopage, setActiveKey, findRecentPage, updateRecent, todoTaskList
    } = homeStore;
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
        if (value === "3") {
            const params = {
                assignUserId: userId,
                status: 1,
                isExpire: 2,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
            findTodopage(params, null)
        } else {
            findTodopage({
                assignUserId: userId,
                status: value,
                isExpire: 0,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }, null)

        }

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
                            recentProjectList && recentProjectList.length > 0 ? 
                            recentProjectList.map((item, index) => {
                                return <div className="project-item" key={item.id} onClick={() => goProjectDetail(item)}>
                                    <div className="item-title">
                                        <ImgComponent
                                            src={item.iconUrl}
                                            alt=""
                                            className="icon-32"
                                        />
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
                                <ProjectEmpty description="暂时没有项目~" />
                        }
                    </div>
                </Spin>
            </div>
            <ProjectStatusNum />
            <div className="statistics-box">
                <div className="statistics-box-title">
                    事项统计
                </div>
                <div className="statistics-content">
                    <WorkItemSurvey />
                    <WorkItemTrend />
                </div>

            </div>
            <TodoStatistics isHome={true} />

        </div>
    );
}


export default withRouter(inject("homeStore")(observer(HomeSurvey)));