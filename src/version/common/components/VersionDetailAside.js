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
import VersionChangeModal from "./VersionChangeModal";
import "./versionDetailAside.scss";
import ProjectAside from '../../../common/projectAside/ProjectAside';

const { Sider } = Layout;

const VersionDetailAside = (props) => {
    const { versionDetailStore } = props;
    const { findVersion, version, setVersionRouter, versionRouter } = versionDetailStore;
    //语言包
    const theme = localStorage.getItem("theme")
    const { t, i18n } = useTranslation();
    // 当前选中路由
    const projectId = props.match.params.id;
    const versionId = props.match.params.version;
    const setButton = useRef();
    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const [router, setRouter] = useState();
    useEffect(() => {
        findVersion({ id: versionId }).then(res => {
            if(res.code === 0){
                if (res.data.versionState.id === "222222") {
                    setVersionRouter(doneRouter)
                } else {
                    setVersionRouter(allRouter)
                }
            }
        })
        return;
    }, [versionId])

  
    const allRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/versiondetail/${versionId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/${projectId}/versiondetail/${versionId}/workTable`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'plan-' + theme,
            defaultIcon: "plan-default",
            id: `/${projectId}/versiondetail/${versionId}/plan`,
            key: "plan",
            encoded: "plan",
        }
    ];

    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/${projectId}/versiondetail/${versionId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'work-' + theme,
            defaultIcon: "work-default",
            id: `/${projectId}/versiondetail/${versionId}/workTable`,
            key: "work",
            encoded: "work",
        },
    ]

    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)
    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/projectDetail/${projectId}/version`)
    }

    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={VersionChangeModal}
                initRouters={versionRouter}
                path={path}
                setUrl = {`/${projectId}/versiondetail/${versionId}/setting`}
                backUrl = {`/projectDetail/${projectId}/version`}
            />
        </Fragment>
    )

}
export default withRouter(inject("versionDetailStore")(observer(VersionDetailAside)));