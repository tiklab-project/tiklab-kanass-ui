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
import ProjectAside from '../../../common/projectAside/ProjectAside';
const { Sider } = Layout;

const ProjectDetailAside = (props) => {
    const { project, isShowText, SetIsShowText,  } = props;
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
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
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/project/${projectId}/overview`,
            key: "overview",
            encoded: "Survey"
        },
        {
            title: `${t('line_photo')}`,
            icon: 'line-' + theme,
            defaultIcon: "line-default",
            id: `/project/${projectId}/linemap`,
            key: "linemap",
            encoded: "Pannel",
        },
        {
            title: `${t('work')}`,
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/project/${projectId}/workitem`,
            key: "work",
            encoded: "Work",
        },
        {
            title: `${t('sprint')}`,
            icon: 'sprint-' + theme,
            defaultIcon: "sprint-default",
            id: `/project/${projectId}/sprint`,
            key: "sprint",
            encoded: "Sprint",
        },

        {
            title: `${t('version')}`,
            icon: 'version-' + theme,
            defaultIcon: "version-default",
            id: `/project/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },

        {
            title: "工时",
            icon: 'log-' + theme,
            defaultIcon: "log-default",
            id: `/project/${projectId}/log`,
            key: "log",
            encoded: "log",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/project/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone-' + theme,
            defaultIcon: "milestone-default",
            id: `/project/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "知识库",
            icon: 'repository',
            defaultIcon: "repository",
            id: `/project/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'test',
            defaultIcon: "test",
            id: `/project/${projectId}/test`,
            key: "test",
            encoded: "test",
        }
    ];

    const normalProrouter = (projectId) => [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/project/${projectId}/overview`,
            key: "overview",
            encoded: "Survey"
        },
        {
            title: "计划",
            icon: 'plan-' + theme,
            defaultIcon: "plan-default",
            id: `/project/${projectId}/stage`,
            key: "stage",
            encoded: "stage",
        },
        {
            title: `${t('work')}`,
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/project/${projectId}/workitem`,
            key: "work",
            encoded: "Work",
        },

        {
            title: `${t('version')}`,
            icon: 'version-' + theme,
            defaultIcon: "version-default",
            id: `/project/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },

        {
            title: "工时",
            icon: 'log-' + theme,
            defaultIcon: "log-default",
            id: `/project/${projectId}/log`,
            key: "log",
            encoded: "log",
        },
        {
            title: `${t('statistic')}`,
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/project/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone-' + theme,
            defaultIcon: "milestone-default",
            id: `/project/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "知识库",
            icon: 'repository',
            defaultIcon: "repository",
            id: `/project/${projectId}/wiki`,
            key: "wiki",
            encoded: "wiki",
        },
        {
            title: "测试用例",
            icon: 'test',
            defaultIcon: "test",
            id: `/project/${projectId}/test`,
            key: "test",
            encoded: "test",
        }

    ];

    const [allProjectRouter, setAllProjectRouter] = useState(project?.projectType.type === "scrum" ? scrumProrouter(props.match.params.id) : normalProrouter(props.match.params.id));



    useEffect(() => {
        setAllProjectRouter(project?.projectType.type === "scrum" ? scrumProrouter(project.id) : normalProrouter(project.id))

        return;
    }, [project])


    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={ProjectChangeModal}
                initRouters={allProjectRouter}
                backName = {"返回首页"}
                path={path}
                setUrl = {`/project/${project.id}/set/basicInfo`}
                backUrl = {`/project`}
            />

        </Fragment>
    )

}
export default withRouter(ProjectDetailAside);