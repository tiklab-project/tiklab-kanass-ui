/*
 * @Descripttion: 项目集详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import "./ProjectSetDetailAside.scss";
import ProjectSetSetButton from "./ProjectSetSettingButton";
import ProjectSetChangeModal from "./ProjectSetChangeModal";
import { getUser } from "thoughtware-core-ui";

const { Sider } = Layout;

const ProjectSetDetailAside = (props) => {
    const { systemRoleStore } = props;
    // 切换宽菜单与窄菜单的参数
    const [isShowText, SetIsShowText] = useState(false)
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/prodetail/survey`);
    // 项目集id
    const projectSetId = props.match.params.projectSetId;
    // 路由
    const projectSetRouter = [
        {
            title: `概览`,
            icon: 'survey',
            key: `/projectSetdetail/${projectSetId}/survey`,
            encoded: "Survey",
        },
        {
            title: `项目`,
            icon: 'project',
            key: `/projectSetdetail/${projectSetId}/projectSetProjectList`,
            encoded: "Pannel",
        },
        {
            title: `统计`,
            icon: 'project',
            key: `/projectSetdetail/${projectSetId}/statistics/workItem`,
            encoded: "Statistics",
        }
    ];

    /**
     * 初次进入设置激活导航菜单样式
     */
    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        // 获取项目集权限
        systemRoleStore.getInitProjectPermissions(getUser().userId, projectSetId)
        return
    }, [projectSetId, props.location.pathname])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectMenu = (key) => {
        setSelectKey(key)
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
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='projectSet-detail-side'>
                <div className={`projectSet-aside`}>
                    <ProjectSetChangeModal isShowText={isShowText} projectSetId = {projectSetId}/>
                    <ul className="projectSet-menu">
                        {
                            projectSetRouter && projectSetRouter.map((item, index) => {
                                return isShowText ?
                                    <div className={`projectSet-menu-submenu ${item.key === selectKey ? "projectSet-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.key)}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div> :
                                    <div className={`projectSet-menu-submenu-icon ${item.key === selectKey ? "projectSet-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.key)}
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
                    <ProjectSetSetButton isShowText={isShowText} />
                    <div className="projectSet-expend" onClick={toggleCollapsed} >
                        {/* {
                            isShowText ? <i className="iconfont iconzuo-yuan right" title="收回"></i> :
                                <i className="iconfont iconyou-yuan right" title="展开"></i>
                        } */}
                        {
                            isShowText ? <svg className="menu-icon" aria-hidden="true">
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
export default withRouter(inject("systemRoleStore")(observer(ProjectSetDetailAside)));