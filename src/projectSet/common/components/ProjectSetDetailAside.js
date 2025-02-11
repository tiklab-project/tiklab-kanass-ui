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
import { observer, inject } from "mobx-react";
import "./ProjectSetDetailAside.scss";
import ProjectSetChangeModal from "./ProjectSetChangeModal";
import { getUser } from "tiklab-core-ui";
import ProjectAside from '../../../common/projectAside/ProjectAside';


const ProjectSetDetailAside = (props) => {
    const { systemRoleStore, isShowText, SetIsShowText } = props;
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/prodetail/overview`);
    const path = props.location.pathname.split("/")[3];
    console.log(props.location.pathname.split("/"), path)
    // 项目集id
    const projectSetId = props.match.params.projectSetId;
    // 路由
    const projectSetRouter = [
        {
            title: `概览`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            key: "overview",
            id: `/projectSet/${projectSetId}/overview`,
            encoded: "Survey",
        },
        {
            title: `项目`,
            icon: 'project-' + theme,
            defaultIcon: "project-default",
            key: "project",
            id: `/projectSet/${projectSetId}/project`,
            encoded: "Pannel",
        },
        {
            title: `统计`,
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            key: "statistics",
            id: `/projectSet/${projectSetId}/statistics/workItem`,
            encoded: "Statistics",
        }
    ];

    /**
     * 初次进入设置激活导航菜单样式
     */
    useEffect(() => {
        // 初次进入激活导航菜单
        // setSelectKey(props.location.pathname)
        // 获取项目集权限
        systemRoleStore.getInitProjectPermissions(getUser().userId, projectSetId)
        return
    }, [projectSetId, props.location.pathname])





    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={ProjectSetChangeModal}
                initRouters={projectSetRouter}
                backName = {"返回首页"}
                path={path}
                setUrl={`/projectSet/${projectSetId}/set/basicInfo`}
                backUrl={`/projectSet`}
                iconName = "home"
            />

        </Fragment>
    )

}
export default withRouter(inject("systemRoleStore")(observer(ProjectSetDetailAside)));