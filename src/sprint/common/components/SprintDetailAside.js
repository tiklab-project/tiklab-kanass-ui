/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import SprintChangeModal from "./SprintChangeModal";
import "./sprintDetailAside.scss";
import Logo from "../../../home/common/components/Logo";
import MenuUser from "../../../common/menuUser/MenuUser";
import ProjectAside from '../../../common/projectAside/ProjectAside';
const { Sider } = Layout;

const SprintDetailAside = (props) => {
    const { sprintDetailStore } = props;
    const { findSprint, sprint, sprintRouter, setSprintRouter } = sprintDetailStore;
    //语言包
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
    // 当前选中路由
    const project = JSON.parse(localStorage.getItem("project"));
    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;

    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const { t, i18n } = useTranslation();
    const allRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/sprintdetail/${sprintId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/${projectId}/sprintdetail/${sprintId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'plan-' + theme,
            defaultIcon: "plan-default",
            id: `/${projectId}/sprintdetail/${sprintId}/plan`,
            key: "plan",
            encoded: "plan",
        },
        {
            title: "统计",
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/${projectId}/sprintdetail/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ];

    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/sprintdetail/${sprintId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/${projectId}/sprintdetail/${sprintId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "统计",
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/${projectId}/sprintdetail/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ]
    useEffect(() => {
        findSprint({ id: sprintId }).then(res => {
            if (res.data.sprintState.id === "222222") {
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
        props.history.push(`/projectDetail/${projectId}/sprint`)
    }
    const setButton = useRef(null)
    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={SprintChangeModal}
                initRouters={sprintRouter}
                path={path}
                setUrl = {`/${projectId}/sprintdetail/${sprintId}/setting`}
                backUrl = {`/projectDetail/${projectId}/sprint`}
            />
        </Fragment>
    )

}
export default withRouter(inject("sprintDetailStore")(observer(SprintDetailAside)));