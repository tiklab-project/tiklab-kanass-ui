/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import SprintChangeModal from "./SprintChangeModal";
import "./sprintDetailAside.scss"
const { Sider } = Layout;

const SprintDetailAside = (props) => {
    const { sprintDetailStore } = props;
    const { findSprint, sprint } = sprintDetailStore;
    //语言包

    // 当前选中路由
    const project = JSON.parse(localStorage.getItem("project"));
    const sprintId = props.match.params.sprint;

    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const [router, setRouter] = useState();
    const { t, i18n } = useTranslation();
    const allRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/plan`,
            key: "plan",
            encoded: "plan",
        },
        {
            title: "统计",
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ];

    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "统计",
            icon: 'survey',
            url: `/${project.id}/sprintdetail/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ]
    useEffect(() => {
        findSprint({ id: sprintId }).then(res => {
            if (res.data.sprintState.id === "222222") {
                setRouter(doneRouter)
            } else {
                setRouter(allRouter)
            }
        })
        return;
    }, [sprintId])

    // 路由




    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)

    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/projectDetail/${project.id}/sprint`)
    }
    const setButton = useRef(null)
    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="200" className='sprint-detail-side'>
                <div className={`sprint-aside-content ${isShowText ? "" : "sprint-icon"}`}>
                    <SprintChangeModal
                        isShowText={isShowText}
                        sprint={sprint}
                    />

                    <ul className="sprint-menu">
                        <div className="sprint-back-project">
                            {
                                isShowText ?
                                    <div className={`sprint-menu-submenu`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="menu-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回项目
                                        </span>
                                    </div>
                                    :
                                    <div className={`sprint-menu-submenu-icon`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回项目
                                        </span>
                                    </div>
                            }

                        </div>
                        {
                            router && router.map((item, index) => {
                                return isShowText ?
                                    <div className={`sprint-menu-submenu ${path.indexOf(item.key) !== -1 ? "sprint-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
                                    >
                                        <svg className="menu-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                    :
                                    <div className={`sprint-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "sprint-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>

                            })
                        }
                    </ul>
                    <div onClick={() => props.history.push(`/${project.id}/sprintdetail/${sprintId}/setting`)} ref={setButton} className="sprint-set-icon setting">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-set"></use>
                        </svg>
                        <span>
                            设置
                        </span>
                    </div>
                    {/* <div className="sprint-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ?
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-leftcircle"></use>
                                </svg>
                                :
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-rightcircle"></use>
                                </svg>
                        }
                    </div> */}
                </div>
            </Sider>
        </Fragment>
    )

}
export default withRouter(inject("sprintDetailStore")(observer(SprintDetailAside)));