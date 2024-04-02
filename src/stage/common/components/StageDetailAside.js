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
import StageChangeModal from "./StageChangeModal";
import "./stageDetailAside.scss"
const { Sider } = Layout;

const StageDetailAside = (props) => {
    const { stageDetailStore } = props;
    const { findStage, stage, stageRouter, setStageRouter } = stageDetailStore;
    //语言包

    // 当前选中路由
    const project = JSON.parse(localStorage.getItem("project"));
    const stageId = props.match.params.stage;
    const projectId = props.match.params.id;

    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const { t, i18n } = useTranslation();
    const allRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/plan`,
            key: "plan",
            encoded: "plan",
        }
    ];

    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/workTable`,
            key: "work",
            encoded: "work",
        }
    ]
    useEffect(() => {
        findStage({ id: stageId }).then(res => {
            if (res.data.status === "2") {
                setStageRouter(doneRouter)
            } else {
                setStageRouter(allRouter)
            }
        })
        return;
    }, [stageId])




    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)

    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/projectDetail/${projectId}/stage`)
    }
    const setButton = useRef(null)
    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="200" className='stage-detail-side'>
                <div className={`stage-aside-content ${isShowText ? "" : "stage-icon"}`}>
                    <StageChangeModal
                        isShowText={isShowText}
                        stage={stage}
                    />

                    <ul className="stage-menu">
                        <div className="stage-back-project">
                            {
                                isShowText ?
                                    <div className={`stage-menu-submenu`}
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
                                    <div className={`stage-menu-submenu-icon`}
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
                            stageRouter && stageRouter.map((item, index) => {
                                return isShowText ?
                                    <div className={`stage-menu-submenu ${path.indexOf(item.key) !== -1 ? "stage-menu-select" : ""}`}
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
                                    <div className={`stage-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "stage-menu-select" : ""}`}
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
                    <div onClick={() => props.history.push(`/${projectId}/stagedetail/${stageId}/setting`)} ref={setButton} className="stage-set-icon setting">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-set"></use>
                        </svg>
                        <span>
                            设置
                        </span>
                    </div>
                    {/* <div className="stage-expend" onClick={toggleCollapsed} >
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
export default withRouter(inject("stageDetailStore")(observer(StageDetailAside)));