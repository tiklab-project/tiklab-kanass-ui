/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:48:45
 */
import React, { useState, useEffect } from 'react';

import { renderRoutes } from "react-router-config";
import "./Layout.scss";

import { inject, observer, Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";

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
        if (props.location.pathname === "/") {

            props.history.push("/index/overview");
        }
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }

    }, [])
    return (
        <Provider {...store}>
            <div className="layout">
                <FirstMenu {...props} />
                <div className="layout-right">
                    
                    {renderRoutes(route)}
                </div>

            </div>
        </Provider>

    )
}
export default inject("systemRoleStore")(observer(Layout));