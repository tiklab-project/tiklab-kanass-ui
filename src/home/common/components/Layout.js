/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, { useState, useEffect } from 'react';

import { renderRoutes } from "react-router-config";
import Header from "./Header";
import "./Layout.scss";

import { inject, observer, Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";
import { AppLink, AvatarLink, HelpLink } from 'tiklab-licence-ui';
import FirstMenu from './FirstMenu';
import { getUser } from 'tiklab-core-ui';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }
    const {systemRoleStore} = props;
    const route = props.route.routes;
    const pathname = props.location.pathname.split("/")[1];
    console.log(pathname)
    const user = getUser();
    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }
        return;
    }, [])
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
export default inject("systemRoleStore")(observer(Layout));