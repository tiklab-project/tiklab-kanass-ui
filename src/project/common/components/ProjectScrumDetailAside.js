/*
 * @Descripttion: 敏捷开发项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { Fragment, useState, useEffect } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import SetScrumMenu from "./SetScrumMenu";
import ProjectChangeModal from "./ProjectChangeModal";
import MoreMenuModel from "./MoreMenuModal";
const { Sider } = Layout;

const ProdeScrumAside = (props) => {
    const { searchpro, project } = props;
    //语言包
    const { t, i18n } = useTranslation();
    // 项目id
    const projectId = props.match.params.id;
    // 菜单的形式，宽菜单，窄菜单
    const [isShowText, SetIsShowText] = useState(false)
    // 当前选中菜单key
    const path = props.location.pathname.split("/")[4];
    // 路由
    const scrumProrouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/index/projectDetail/${projectId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: `${t('line_photo')}`,
            icon: 'line',
            url: `/index/projectDetail/${projectId}/linemap`,
            key: "linemap",
            encoded: "Pannel",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            url: `/index/projectDetail/${projectId}/work`,
            key: "work",
            encoded: "Work",
        },
        {
            title: `${t('sprint')}`,
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/sprint`,
            key: "sprint",
            encoded: "Sprint",
        },
        {
            title: "测试用例",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/test`,
            key: "test",
            encoded: "test",
        },
        {
            title: "知识库",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: `${t('version')}`,
            icon: 'version',
            url: `/index/projectDetail/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            url: `/index/projectDetail/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "工时",
            icon: 'log',
            url: `/index/projectDetail/${projectId}/log`,
            key: "log",
            encoded: "log",
        }
    ];

    const normalProrouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/index/projectDetail/${projectId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "计划",
            icon: 'survey',
            url: `/index/projectDetail/${projectId}/stage`,
            key: "stage",
            encoded: "stage",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            url: `/index/projectDetail/${projectId}/work`,
            key: "work",
            encoded: "Work",
        },
        {
            title: "测试用例",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/test`,
            key: "test",
            encoded: "test",
        },
        {
            title: "知识库",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: `${t('version')}`,
            icon: 'version',
            url: `/index/projectDetail/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            url: `/index/projectDetail/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "工时",
            icon: 'log',
            url: `/index/projectDetail/${projectId}/log`,
            key: "log",
            encoded: "log",
        }
    ];

    const prorouter = project?.projectType.type === "scrum" ? scrumProrouter : normalProrouter;
    useEffect(() => {
        // setWorkType(null)
        return
    }, [projectId, props.location.pathname])

    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectMenu = (key) => {
        // setSelectKey(key)
        props.history.push(key)

    }

    /**
     * 点击折叠或展开菜单
     */
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='project-detail-side'>
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    <ProjectChangeModal  
                        isShowText = {isShowText} 
                        searchpro = {searchpro}
                        project = {project}
                    />
                    <ul className="project-menu">
                        {
                            prorouter && prorouter.map((item,index) =>  {return isShowText ? 
                                <div className={`project-menu-submenu ${path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
                                    key={item.encoded}
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
                                <div className={`project-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
                                    key={item.encoded}
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
                        <MoreMenuModel isShowText = {isShowText}/>
                    </ul>
                    <SetScrumMenu isShowText = {isShowText}/>
                    <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ?<svg className="menu-icon" aria-hidden="true">
                                <use xlinkHref="#icon-leftcircle"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightcircle"></use>
                            </svg>
                        }
                    </div>
                </div>
            </Sider>
                    
        </Fragment>
    )

}
export default withRouter(ProdeScrumAside);