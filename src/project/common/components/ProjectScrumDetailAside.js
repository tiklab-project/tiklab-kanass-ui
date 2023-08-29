/*
 * @Descripttion: 敏捷开发项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
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
    const projectMenu = useRef();
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
            url: `/index/projectDetail/${projectId}/workTable`,
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
        },
        {
            title: "知识库",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/test`,
            key: "test",
            encoded: "test",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statisticslog',
            url: `/index/projectDetail/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
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
            url: `/index/projectDetail/${projectId}/workTable`,
            key: "work",
            encoded: "Work",
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
        },
        {
            title: "知识库",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'sprint',
            url: `/index/projectDetail/${projectId}/test`,
            key: "test",
            encoded: "test",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statisticslog',
            url: `/index/projectDetail/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        }
    ];

    const [projectRouter, setProjectRouter] = useState(project?.projectType.type === "scrum" ? scrumProrouter : normalProrouter); 

    const [moreMenu, setMoreMenu] = useState()

    const [morePath, setMorePath] = useState()
    const resizeUpdate = (e) => {
        // console.log(e.innerHeight)
        // let h = e.target.innerHeight;
        // setHeight(h);
        // 通过事件对象获取浏览器窗口的高度
        const documentHeight = e.target ? e.target.innerHeight : e.clientHeight;
        // console.log(documentHeight)
        // setHeight(documentHeight);
        const menuHeight = documentHeight - 200;
        const menuNum = Math.floor(menuHeight / 60);
        console.log(menuHeight, menuNum)
        let num  = 0;
        if(project?.projectType.type === "scrum"){
            num= menuNum > 7 ? 7 : menuNum;
        }else {
            num = menuNum > 7 ? 7 : menuNum;
        }
        setProjectRouter(projectRouter.slice(0, num))
        const hiddenMenu = projectRouter.slice(num, projectRouter.length)
        setMoreMenu(hiddenMenu)
        let data = [];
        hiddenMenu.map(item =>{
            
            data.push(item.key)
            
        })
        setMorePath([...data])
    };

    useEffect(() => {
        // let h = window.innerHeight;
        // setHeight(h)
        resizeUpdate(document.getElementById("root"))
        window.addEventListener("resize", resizeUpdate);
        return () => {
            // 组件销毁时移除监听事件
            window.removeEventListener('resize', resizeUpdate);
        }
    }, [])
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
                    <div className="project-menu" ref = {projectMenu}>
                        {
                            projectRouter && projectRouter.map((item,index) =>  {return isShowText ? 
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
                        {moreMenu && <MoreMenuModel isShowText = {isShowText} moreMenu = {moreMenu} morePath = {morePath}/>}
                    </div>
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