/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-15 16:19:22
 */
import React, { Fragment, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import "../components/Log.scss";
const { Sider } = Layout;

const Log = (props) => {
    const route = props.route
    return (
        <div className="log">
            <Row style={{ height: "100%" }}>
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    {renderRoutes(route.routes)}
                </Col>
            </Row>
        </div>

    )
}
export default Log;