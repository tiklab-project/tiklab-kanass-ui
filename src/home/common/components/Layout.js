/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, { useState } from 'react';

import { renderRoutes } from "react-router-config";
import Header from "./Header";
import "./Layout.scss";

import { Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";
import { AppLink, HelpLink, AvatarLink } from 'thoughtware-licence-ui';
import FirstMenu from './FirstMenu';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }
    const showFirstMenu = ["home", "project", "projectSetList", "workTable", "setting", "log"]
    const route = props.route.routes;
    const pathname = props.location.pathname.split("/")[1];


    return (
        <Provider {...store}>
            <div className="layout">
                <Header {...props} />
                <div className="layout-content">
                    {
                        showFirstMenu.indexOf(pathname) > -1 && <FirstMenu AppLink={AppLink} {...props} />
                    }
                    <div className="layout-page">
                        {renderRoutes(route)}
                    </div>
                </div>

            </div>
        </Provider>

    )
}

export default Layout;