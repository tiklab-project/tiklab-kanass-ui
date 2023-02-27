/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, { Fragment } from "react";
import StatisticsAsicde from "../components/ProjectSetStatisticsAside";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";
import "../components/ProjectSetStatistics.scss"
const { Sider } = Layout;
const ProjectSetStatistics = (props) => {
    const route = props.route
    return (
        <Layout className="projectSet-statistics">
            <Sider trigger={null} width="250">
                <StatisticsAsicde
                    {...props}
                />
            </Sider>

            <Layout className="projectSet-statistics-content" style={{ background: "#fff" }}>
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    )

}
export default withRouter(ProjectSetStatistics);  