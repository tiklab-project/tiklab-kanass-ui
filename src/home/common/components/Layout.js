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
import {matchPath} from "react-router";
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


    // 外层的路由：只有下面的路由才展示侧边栏
    const showFirstMenuPaths = [
        '/index/overview',
        '/index/todoList',
        '/index/insightlist',
        '/project',
        '/projectSet',
        '/product',
        '/workitem',
        '/log/list',
        '/log/statistics',
        '/log/statistics/projectuser',
        '/log/statistics/projectwork',
        '/log/statistics/userproject',
        '/workitem/:id',
        '/statistics/overview',
        '/statistics/projectSet/member',
        '/statistics/projectSet/workItem',
        '/statistics/projectSet/projectProgress',
        '/statistics/project/memberItem',
        '/statistics/workItem/newTrend',
        '/statistics/workItem/completeTrend',
        '/statistics/workItem/overview',
        '/statistics/workItem/workItemTrend',
        '/statistics/log/projectuser',
        '/statistics/log/projectwork',
        '/statistics/log/userproject'
    ];


    let curPath = props.location.pathname

    // 判断当前路径是否匹配精确路径或以 /workitem 开头
    const showFirstMenu = showFirstMenuPaths.includes(curPath) || curPath.startsWith('/workitem') || curPath.startsWith('/index');



    return (
        <Provider {...store}>
            <div className="layout">
                {showFirstMenu && <FirstMenu {...props} />}
                <div className="layout-right">
                    {renderRoutes(route)}
                </div>

            </div>
        </Provider>

    )
}
export default inject("systemRoleStore")(observer(Layout));