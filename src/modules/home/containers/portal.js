/*
 * @Descripttion: 页面主题框架
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-17 09:37:55
 */
import React, { useEffect, useState } from 'react';
import logo from "../../../assets/images/logo.png";
import { renderRoutes } from "react-router-config";
import { withRouter } from 'react-router';
import useAppConfig from "../../../common/changeAPP/appLink";
import LocalHeader from "../components/header";
import "../components/header.scss";
import "../components/homePage.scss";

import { useAccountConfig, loginOutLocal, loginOutAcc, useBasePortal,useSassPortal } from 'doublekit-portal-ui';
import { inject, observer } from 'mobx-react';
import Search from "../../search/container/search";
const Index = (props) => {
    const route = props.route;
    const { portalLoginStore } = props;
    const authData = useAccountConfig();
    const routers = [
        {
            to: '/index/home',
            title: '首页',
            key: 'home'
        },
        {
            to: '/index/project',
            title: '项目',
            key: 'project'
        },
        {
            to: '/index/program/programList',
            title: '项目集',
            key: 'program'
        },
        // {
        //     to: '/index/work/',
        //     title: '事项',
        //     key: 'sx'
        // },
        {
            to: '/index/log',
            title: '日志',
            key: 'rz'
        },
        {
            to: '/index/organ/organ',
            title: '系统管理',
            key: 'Orga'
        }
    ]
    const [component, ModalComponent, editOrAddModal] = useAppConfig(false);

    // 登录跳转
    useBasePortal(portalLoginStore, props.history, '/login');
    

    const projectLogout = () => {
        if (authData.authType === "acc") {
            loginOutAcc(authData.authAccConfig.accUrl)
        }
        if (authData.authType === "local") {
            loginOutLocal(props.history, portalLoginStore)
        }


    }

    return (
        <div className="frame">
            <LocalHeader
                {...props}
                logo={logo}
                AppConfigComponent={component}
                projectLogout={projectLogout}
                search={<Search {...props}/>}
                routers={routers}
            >
            </LocalHeader>
            <div>
                {renderRoutes(route.routes)}
            </div>
            {ModalComponent}
            {editOrAddModal}
        </div>
    )
}
export default withRouter(inject("portalLoginStore")(observer(Index)));