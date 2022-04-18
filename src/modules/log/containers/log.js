/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-15 16:19:22
 */
import React, { Fragment, useEffect } from 'react';
import LogSide from "../components/logAside";
import { Layout, Row, Col } from 'antd';
import LogContent from "../components/logContent";
import "../components/log.scss";
import { observer, inject } from "mobx-react";
const { Sider } = Layout;

const Log = (props) => {
    return (
        <div className="log">
            <Layout className="log-content">
                <Sider>
                    <LogSide />
                </Sider>
                <Layout className="log-table">
                    <LogContent />
                </Layout>
            </Layout>
        </div>
    )
}
export default Log;