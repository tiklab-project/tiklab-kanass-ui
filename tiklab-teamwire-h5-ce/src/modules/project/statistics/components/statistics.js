/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, { Fragment } from "react";
import StatisticsAsicde from "./statisticsList";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";

const Statistics = (props) => {
    const route = props.route
    return (<Row >
            <Col lg={{ span: "22", offset: "1" }} xl={{ span: "18", offset: "3" }}>
                <Layout className="project-statistics">
                    <StatisticsAsicde
                        {...props}
                    />
                    <Layout className="statistics-content" style={{ background: "#fff" }}>
                        {renderRoutes(route.routes)}
                    </Layout>
                </Layout>
            </Col>
        </Row>
    )

}
export default withRouter(Statistics);  