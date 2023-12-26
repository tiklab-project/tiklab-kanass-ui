/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState, useRef } from "react";
import { Provider, inject, observer } from "mobx-react";
import { Layout } from "antd";
import { renderRoutes } from "react-router-config";
import LogStatisticsAside from "./LogStatisticsAside";
import "./LogStatistics.scss"
const LogStatistics = (props) => {
    const { route } = props;
    

    
    return (<Provider>
        <Layout className="log-statistics">
            <LogStatisticsAside />
            <Layout className="log-statistics-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>
        
    )
}
export default observer(LogStatistics);