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
import { AppLink, AvatarLink, HelpLink } from 'thoughtware-licence-ui';
import FirstMenu from './FirstMenu';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }

    const route = props.route.routes;
    const pathname = props.location.pathname.split("/")[1];
    console.log(pathname)

    return (
        <Provider {...store}>
            <div className="layout">
                <FirstMenu AppLink={AppLink} {...props} />
                <div className="layout-right">
                    
                    {renderRoutes(route)}
                </div>

            </div>
        </Provider>

    )
}

export default Layout;