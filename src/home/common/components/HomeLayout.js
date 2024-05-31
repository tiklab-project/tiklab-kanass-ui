/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React from 'react';

import { renderRoutes } from "react-router-config";
import Header from "./Header";
import "./HomeLayout.scss";

import { Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";
import { AppLink, HelpLink, AvatarLink } from 'thoughtware-licence-ui';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }
    const route = props.route.routes;

    return (
        <Provider {...store}>
            <div className="frame">
                <Header AppLink= {AppLink} HelpLink = {HelpLink} AvatarLink = {AvatarLink} {...props} />
                <div className="frame-content">
                    {renderRoutes(route)}
                </div>
            </div>
        </Provider>

    )
}

export default Layout;