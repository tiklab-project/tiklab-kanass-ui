/*
 * @Descripttion: 日志统计页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect, useState } from "react";
import { observer, Provider } from "mobx-react";
import { Layout, } from 'antd';
import "./Log.scss"
import LogStore from "../logView/store/LogStore";
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import LogAside from "./LogAside";
const { Sider,Content } = Layout;
const LogContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const { route } = props;

    return (<Provider {...store}>
        <Layout className="log">
            <Sider width={200} className="site-layout-background">
                <LogAside />
            </Sider>

            <Layout className="log-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>

    )
}
export default withRouter(observer(LogContent));