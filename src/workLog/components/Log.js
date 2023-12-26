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
import { Table, Row, Col, Space } from 'antd';
import Breadcumb from "../../common/breadcrumb/Breadcrumb";
import "./Log.scss"
import LogStore from "../store/LogStore";
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";

const LogContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const {route} = props;
    const [menu, setMenu] = useState("logList")
    const onChange = (value) => {
        setMenu(value.key)
        props.history.push(value.url)
    }
    
    const routers = [
        {
            title: "工时查询",
            url: "/log/list",
            key: "logList"
        },
        {
            title: "工时统计",
            url: "/log/statistics",
            key: "logStatistics"
        },
    ]
    return (<Provider {...store}>
        <Row style={{ height: "100%", background: "#fff", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "20", offset: "2" }}>
                <div className="log">
                    <Breadcumb
                        {...props}
                        firstText="工时"
                    >
                        <div className="log-tab">
                            {
                                routers.map(item => {
                                    return <div
                                    key = {item.key}
                                    className={`log-tab-tabpane ${menu === item.key ? "log-tabpane-select" : ""}`}
                                    onClick={() => onChange(item)}
                                >
                                    {item.title}
                                </div>
                                })
                            }
                        </div>
                        
                    </Breadcumb>
                    {renderRoutes(route.routes)}
                </div>
            </Col>
        </Row>
    </Provider>

    )
}
export default withRouter(observer(LogContent));