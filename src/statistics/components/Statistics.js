/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, { Fragment } from "react";
import StatisticsAside from "./StatisticsAside";
import { Layout } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";
import "./Statistics.scss"
const { Sider } = Layout;
const ProjectStatistics = (props) => {
    const route = props.route
    return (
        <Layout className="porject-statistics">
            <Sider trigger={null} width="250">
                <StatisticsAside
                    {...props}
                />
            </Sider>

            <Layout className="porject-statistics-content" style={{ background: "#fff" }}>
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    )

}
export default withRouter(ProjectStatistics);  