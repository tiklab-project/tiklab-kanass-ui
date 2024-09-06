/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:13:36
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";

import { useTranslation } from 'react-i18next';
import { PrivilegeProjectButton, ProjectNav } from "thoughtware-privilege-ui";
const { Sider } = Layout;
const ProjectScrumSetAside = (props) => {
    const { prorouter } = props;
    //语言包
    const { t } = useTranslation();
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 路由
    // const prorouter = [
    //     {
    //         title: `${t('projectInfo')}`,
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/basicInfo`,
    //         encoded: "Survey",
    //     },
    //     {
    //         title: "事项类型",
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/projectWorkType`,
    //         encoded: "WorkType",
    //     },
    //     {
    //         title: `${t('user')}`,
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/user`,
    //         encoded: "User",
    //     },
    //     {
    //         title: `${t('privilege')}`,
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/projectDomainRole`,
    //         encoded: "Privilege",
    //     },
    //     {
    //         title: "流程",
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/projectFlow`,
    //         encoded: "WorkFlow",
    //     },
    //     {
    //         title: "表单",
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/projectForm`,
    //         encoded: "WorkForm",
    //     },
    //     {
    //         title: `${t('module')}`,
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/module`,
    //         encoded: "Module"
    //     },
    //     {
    //         title: `消息通知方案`,
    //         icon: 'survey',
    //         id: `/project/${projectId}/set/messagenotice`,
    //         encoded: "messagenotice"
    //     }
    // ];
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/project/${projectId}/set/basicInfo`);

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)



    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        return
    }, [projectId])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectKeyFun = (key) => {
        setSelectKey(key)
        props.history.push(key)

    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="50" width="200">
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    <div className="project-title title">
                        设置
                    </div>
                    <ProjectNav
                        {...props}
                        domainId={projectId}
                        projectRouters={prorouter}
                        outerPath={`/project/${projectId}/set`} // 系统设置Layout路径
                        noAccessPath={`/project/${projectId}/set/noAccess`}  //找不到页面路径
                    >
                        <ul className="project-menu">
                            {
                                prorouter && prorouter.map(item => {
                                    return ( <PrivilegeProjectButton code={item.purviewCode} disabled={"hidden"} domainId={projectId}  {...props}>
                                        <div className={`project-menu-submenu ${item.id === selectKey ? "project-menu-select" : ""}`}
                                            key={item.id}
                                            onClick={() => selectKeyFun(item.id)}
                                        >
                                            <span className={`${isShowText ? "" : "project-notext"}`}>
                                                {item.title}
                                            </span>
                                        </div>
                                    </PrivilegeProjectButton>
                                    )
                                    
                                })
                            }
                        </ul>
                    </ProjectNav>

                </div>
            </Sider>
        </Fragment>
    )

}
export default withRouter(ProjectScrumSetAside);