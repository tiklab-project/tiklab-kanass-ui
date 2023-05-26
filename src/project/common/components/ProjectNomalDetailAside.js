/*
 * @Descripttion: 瀑布式开发的项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import SetNomalMenu from "./SetNomalMenu";
import ProjectChangeModal from "./ProjectChangeModal";
import MoreMenuModal from "./MoreMenuModal";
const { Sider } = Layout;

const ProdeNomalAside = (props) => {
    const { searchpro, workStore, project } = props;
    const { setWorkType, setWorkId } = workStore;
    //语言包
    const { t, i18n } = useTranslation();
    // 项目id
    const projectId = props.match.params.id;
    // 菜单的形式，宽菜单，窄菜单
    const [isShowText, SetIsShowText] = useState(false)
    // 当前选中菜单key
    const path = props.location.pathname.split("/")[4];
    
     // 菜单路由
     const normalProrouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/index/projectNomalDetail/${projectId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "计划",
            icon: 'survey',
            url: `/index/projectNomalDetail/${projectId}/stage`,
            key: "stage",
            encoded: "stage",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            url: `/index/projectNomalDetail/${projectId}/work`,
            key: "work",
            encoded: "Work",
        },
        {
            title: "测试用例",
            icon: 'sprint',
            url: `/index/projectNomalDetail/${projectId}/test`,
            key: "test",
            encoded: "test",
        },
        {
            title: "知识库",
            icon: 'sprint',
            url: `/index/projectNomalDetail/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: `${t('version')}`,
            icon: 'version',
            url: `/index/projectNomalDetail/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            url: `/index/projectNomalDetail/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "工时",
            icon: 'log',
            url: `/index/projectNomalDetail/${projectId}/log`,
            key: "log",
            encoded: "log",
        }
    ];
    
    useEffect(() => {
        setWorkType(null)
        return
    }, [projectId,props.location.pathname])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectMenu = (key) => {
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
                        // prolist = {prolist} 
                        searchpro = {searchpro}
                        setWorkType= {setWorkType}
                        project = {project}
                    />
                    <ul className="project-menu">
                        {
                            normalProrouter && normalProrouter.map((item,index) =>  {
                                return isShowText ? 
                                    <div className={`project-menu-submenu ${ path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
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
                                    <div className={`project-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
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
                        <MoreMenuModal isShowText = {isShowText}/>
                    </ul>
                    <SetNomalMenu isShowText = {isShowText}/>
                    <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? 
                            <svg className="menu-icon" aria-hidden="true">
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
export default withRouter(inject( "workStore",'systemRoleStore')(observer(ProdeNomalAside)));