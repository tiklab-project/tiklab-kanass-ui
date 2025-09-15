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
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { PrivilegeProjectButton, ProjectNav } from "tiklab-privilege-ui";
const { Sider } = Layout;
const ProjectScrumSetAside = (props) => {
    const { prorouter } = props;
    //语言包
    const { t } = useTranslation();
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 路由
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/project/${projectId}/set/basicInfo`);

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)
    const [expandedTree, setExpandedTree] = useState([])



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

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const renderMenu = (item, deep = 0) => {
        return (
            <PrivilegeProjectButton code={item.purviewCode} disabled={"hidden"} domainId={projectId}  {...props}>
                <li className={`project-menu-submenu ${item.id === selectKey ? "project-menu-select" : ""}`}
                    key={item.id}
                    onClick={() => selectKeyFun(item.id)}
                    style={{ paddingLeft: `${deep * 20 + 20}px` }}
                >
                    <span className={`${isShowText ? "" : "project-notext"}`}>
                        {item.title}
                    </span>
                </li>
            </PrivilegeProjectButton>
        )
    }

    const renderSubMenu = (item, deep = 0) => {
        return (
            <li key={item.id} className="project-submenu-li">
                <div className={`project-menu-submenu ${item.id === selectKey ? "project-menu-select" : ""}`}
                    onClick={() => setOpenOrClose(item.id)}
                    style={{ paddingLeft: `${deep * 20 + 20}px` }}
                >
                    <span className={`${isShowText ? "" : "project-notext"}`}>
                        {item.title}
                    </span>
                    <span style={{ float: "right" }}>
                        {
                            item.children ?
                                (isExpandedTree(item.id) ?
                                    <DownOutlined style={{ fontSize: "10px" }} /> :
                                    <UpOutlined style={{ fontSize: "10px" }} />
                                ) : null
                        }
                    </span>
                </div>
                <ul className={`project-menu ${isExpandedTree(item.id) ? "" : "hidden-menu"}`}>
                    {
                        item.children && item.children.map(child => (
                            child.children && child.children.length ?
                                renderSubMenu(child, deep + 1) : renderMenu(child, deep + 1)
                        ))
                    }
                </ul>
            </li>
        )
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="50">
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
                                prorouter && prorouter.map(item => (
                                    item.children && item.children.length > 0 ?
                                        renderSubMenu(item, 0) : renderMenu(item, 0)
                                ))
                            }
                        </ul>
                    </ProjectNav>

                </div>
            </Sider>
        </Fragment>
    )

}
export default withRouter(ProjectScrumSetAside);