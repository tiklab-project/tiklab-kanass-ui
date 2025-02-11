/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-23 11:19:33
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import SprintChangeModal from "./SprintChangeModal";
import "./sprintDetailAside.scss";
import ProjectAside from '../../../common/projectAside/ProjectAside';


const SprintDetailAside = (props) => {
    const { sprintDetailStore } = props;
    const { findSprint, sprint, sprintRouter, setSprintRouter } = sprintDetailStore;
    //语言包
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
    // 当前选中路由
    const project = JSON.parse(localStorage.getItem("project"));
    const sprintId = props.match.params.sprint;
    console.log("aside", sprintId)
    const projectId = props.match.params.id;

    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const { t, i18n } = useTranslation();
    const allRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/sprint/${sprintId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'workitem-' + theme,
            defaultIcon: "workitem-default",
            id: `/${projectId}/sprint/${sprintId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'plan-' + theme,
            defaultIcon: "plan-default",
            id: `/${projectId}/sprint/${sprintId}/plan`,
            key: "plan",
            encoded: "plan",
        },
        {
            title: "统计",
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/${projectId}/sprint/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ];

    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/sprint/${sprintId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'workitem-' + theme,
            defaultIcon: "workitem-default",
            id: `/${projectId}/sprint/${sprintId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "统计",
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/${projectId}/sprint/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ]
    useEffect(() => {
        findSprint({ id: sprintId }).then(res => {
            if (res.data?.sprintState.id === "222222") {
                setSprintRouter(doneRouter)
            } else {
                setSprintRouter(allRouter)
            }
        })
        return;
    }, [sprintId])

    // 路由




    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)

    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/project/${projectId}/sprint`)
    }
    const setButton = useRef(null)
    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={SprintChangeModal}
                initRouters={sprintRouter}
                backName = {"返回项目"}
                path={path}
                setUrl = {`/${projectId}/sprint/${sprintId}/setting`}
                backUrl = {`/project/${projectId}/sprint`}
                iconName = "back"
            />
        </Fragment>
    )

}
export default withRouter(inject("sprintDetailStore")(observer(SprintDetailAside)));