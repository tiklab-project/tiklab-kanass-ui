/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-28 19:26:26
 */
import React, { Fragment,useEffect } from "react";
import StatisticsAsicde from "../components/statisticsAside";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";

const Statistics = (props) => {
    const route = props.route
    useEffect(() => {
        props.history.push("/index/prodetail/sprintdetail/SprintStatisticsWork")
        return
    }, [])
    return (
        <Layout className="sprint-statistics">
            <StatisticsAsicde
                {...props}
            />
            <Layout className="statistics-content" style={{ padding: "10px", background: "#fff" }}>
                {renderRoutes(route.routes)}
            </Layout>

        </Layout>
    )

}
export default Statistics;  