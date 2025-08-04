/*
 * @Descripttion: 日志页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 09:43:27
 */
import React, { useEffect, useState } from "react";
import { observer, Provider } from "mobx-react";
import {Col, Layout, Row,} from 'antd';
import "./Log.scss"
import LogStore from "../logView/store/LogStore";
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import LogAside from "./LogAside";
import Breadcrumb from "../../common/breadcrumb/Breadcrumb";
const { Sider,Content } = Layout;
const LogContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const { route } = props;
    const [selectTab, setSelectTab] = useState("list");

    const logTabs = [
        {
            title: "工时日志",
            id: `/log/list`,
            key: "list",
            encoded: "list",
        },
        {
            title: "工时统计",
            id: `/log/statistics`,
            key: "statistics",
            encoded: "statistics",
        }
    ];

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    return (<Provider {...store}>
        <Layout className="log">
            {/*<Sider width={200} className="site-layout-background">*/}
            {/*    <LogAside />*/}
            {/*</Sider>*/}

            <Row style={{
                // borderBottom: "1px solid var(--tiklab-gray)"
                // backgroundColor: "var(--tiklab-gray)"
            }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "20", offset: "2" }}>
                    <div style={{
                        padding: "0px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "60px",
                        lineHeight: "55px"
                    }}>
                        <Breadcrumb firstText={"工时"}/>
                        <div className="log-top-tabs">
                            {
                                logTabs.map(item => {
                                    return <div
                                        className={`log-tab ${item.key === selectTab ? "log-tab-active" : ""}`}
                                        key={item.key}
                                        onClick={() => handleTabClick(item.key, item.id)}
                                    >
                                        <span>{item.title}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Layout className="log-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Row>
        </Layout>
    </Provider>

    )
}
export default withRouter(observer(LogContent));