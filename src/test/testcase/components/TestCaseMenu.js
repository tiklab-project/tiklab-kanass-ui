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
import "./TestCaseMenu.scss"
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
const { Sider,Content } = Layout;
const TestCaseMenu = (props) => {
    const store = {

    }
    const { route } = props;
    const [selectTab, setSelectTab] = useState("testcase");
    const  projectId = localStorage.getItem("projectId")

    const logTabs = [
        {
            title: "测试用例",
            id: `/project/${projectId}/testcase/caseDetail/info`,
            key: "testcase",
            encoded: "testcase",
        },
        {
            title: "测试计划",
            id: `/project/${projectId}/testcase/testplan`,
            key: "testplan",
            encoded: "testplan",
        }
    ];

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    return (<Provider {...store}>
        <Layout className="log">
            <Row style={{
                borderBottom: "1px solid var(--tiklab-gray)"
                // backgroundColor: "var(--tiklab-gray)"
            }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                    <div style={{
                        padding: "0px 20px",
                        display: "flex",
                        alignItems: "center",
                        // gap: "60px",
                        lineHeight: "55px",
                        justifyContent: "space-between"
                    }}>
                        <Breadcrumb firstText={"测试"}/>
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
                        <div></div>
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
export default withRouter(observer(TestCaseMenu));