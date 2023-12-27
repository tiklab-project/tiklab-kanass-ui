/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, { Fragment } from "react";
import ProjectSetStatisticsAside from "./ProjectSetStatisticsAside";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";
import "../../statistics/components/Statistics.scss";
const { Sider } = Layout;
const ProjectSetStatistics = (props) => {
    const route = props.route
    return (
        <Layout className="statistics">
            <Sider trigger={null} width="250">
                <ProjectSetStatisticsAside {...props} />
            </Sider>

            <Layout className="statistics-content" style={{ background: "#fff" }}>
                <Row>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>
        </Layout>
    )

}
export default withRouter(ProjectSetStatistics);  