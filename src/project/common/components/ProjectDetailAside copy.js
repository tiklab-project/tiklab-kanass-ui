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
import { useTranslation } from 'react-i18next';
import MenuUser from "../../../common/menuUser/MenuUser";
import SetMenu from "./SetMenu";
import ProjectChangeModal from "./ProjectChangeModal";
import MoreMenuModel from "./MoreMenuModal";
import Logo from '../../../home/common/components/Logo';
const { Sider } = Layout;

const ProjectDetailAside = (props) => {
    const { searchpro, project, isShowText, SetIsShowText } = props;
    const projectMenu = useRef();
    //语言包
    const { t, i18n } = useTranslation();
    // 项目id
    // 菜单的形式，宽菜单，窄菜单
    
    // 当前选中菜单key
    const path = props.location.pathname.split("/")[3];
    // 路由
    const scrumProrouter = (projectId) => [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            id: `/project/${projectId}/overview`,
            key: "survey",
            encoded: "Survey"
        },
        {
            title: `${t('line_photo')}`,
            icon: 'line',
            id: `/project/${projectId}/linemap`,
            key: "linemap",
            encoded: "Pannel",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            id: `/project/${projectId}/workitem`,
            key: "work",
            encoded: "Work",
        },
        {
            title: `${t('sprint')}`,
            icon: 'sprint',
            id: `/project/${projectId}/sprint`,
            key: "sprint",
            encoded: "Sprint",
        },

        {
            title: `${t('version')}`,
            icon: 'version',
            id: `/project/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },

        {
            title: "工时",
            icon: 'log',
            id: `/project/${projectId}/log`,
            key: "log",
            encoded: "log",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statisticslog',
            id: `/project/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            id: `/project/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "知识库",
            icon: 'repository',
            id: `/project/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'test',
            id: `/project/${projectId}/test`,
            key: "test",
            encoded: "test",
        }
    ];

    const normalProrouter = (projectId) => [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            id: `/project/${projectId}/overview`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "计划",
            icon: 'survey',
            id: `/project/${projectId}/stage`,
            key: "stage",
            encoded: "stage",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            id: `/project/${projectId}/workitem`,
            key: "work",
            encoded: "Work",
        },
        {
            title: `${t('version')}`,
            icon: 'version',
            id: `/project/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },
        {
            title: "工时",
            icon: 'log',
            id: `/project/${projectId}/log`,
            key: "log",
            encoded: "log",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statisticslog',
            id: `/project/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            id: `/project/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "知识库",
            icon: 'repository',
            id: `/project/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'test',
            id: `/project/${projectId}/test`,
            key: "test",
            encoded: "test",
        }

    ];

    const [allProjectRouter, setAllProjectRouter] = useState(project?.projectType.type === "scrum" ? scrumProrouter(props.match.params.id) : normalProrouter(props.match.params.id));

    const [projectRouter, setProjectRouter] = useState([]);

    const [moreMenu, setMoreMenu] = useState()

    const [morePath, setMorePath] = useState()

    const resizeUpdate = (e) => {
        // 通过事件对象获取浏览器窗口的高度
        const documentHeight = e.target ? e.target.innerHeight : e.clientHeight;

        const menuHeight = documentHeight - 250;
        const menuNum = Math.floor(menuHeight / 60);
        let num = 0;
        if (project?.projectType.type === "scrum") {
            num = menuNum > 7 ? 7 : menuNum;
        } else {
            num = menuNum > 7 ? 7 : menuNum;
        }
        setProjectRouter(allProjectRouter.slice(0, num))
        const hiddenMenu = allProjectRouter.slice(num, allProjectRouter.length)
        setMoreMenu(hiddenMenu)
        let data = [];
        hiddenMenu.map(item => {
            data.push(item.key)
        })
        setMorePath([...data])
    };

    useEffect(() => {
        resizeUpdate(document.getElementById("root"))
        window.addEventListener("resize", resizeUpdate);
        return () => {
            // 组件销毁时移除监听事件
            window.removeEventListener('resize', resizeUpdate);
        }

    }, [allProjectRouter])

    useEffect(() => {
        setAllProjectRouter(project?.projectType.type === "scrum" ? scrumProrouter(project.id) : normalProrouter(project.id))

        return;
    }, [project])
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

    const backProject = () => {
        props.history.push(`/project`)
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="75" width="200" className='project-detail-side'>
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    {/* <Logo isShowText = {isShowText}/> */}
                    <ProjectChangeModal
                        isShowText={isShowText}
                        searchpro={searchpro}
                        project={project}
                    />
                    <div className="project-menu" ref={projectMenu}>
                        <div className="project-back-project">
                            {
                                isShowText ?
                                    <div className={`project-menu-submenu`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="icon-18" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回首页
                                        </span>
                                    </div>
                                    :
                                    <div className={`project-menu-submenu-icon`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回首页
                                        </span>
                                    </div>
                            }
                        </div>
                        {
                            projectRouter && projectRouter.map((item, index) => {
                                return isShowText ?
                                    <div className={`project-menu-submenu ${(path && path.indexOf(item.key) !== -1) ? "project-menu-select" : ""}`}
                                        key={item.encoded}
                                        onClick={() => selectMenu(item.id)}
                                    >
                                        <svg className="icon-18" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                    :
                                    <div className={`project-menu-submenu-icon ${(path && path.indexOf(item.key) !== -1) ? "project-menu-select" : ""}`}
                                        key={item.encoded}
                                        onClick={() => selectMenu(item.id)}
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
                        {moreMenu && <MoreMenuModel isShowText={isShowText} moreMenu={moreMenu} morePath={morePath} />}
                    </div>

                    <SetMenu isShowText={isShowText} />
                    <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? <svg className="project-expend-icon" aria-hidden="true">
                                <use xlinkHref="#icon-leftcircle"></use>
                            </svg>
                                :
                                <svg className="project-expend-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-rightcircle"></use>
                                </svg>
                        }
                    </div>
                </div>
            </Sider>

        </Fragment>
    )

}
export default withRouter(ProjectDetailAside);