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
import "./Statistics.scss"
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import StatisticsAside from "./StatisticsAside";
import {LogStore} from "../../workLog/logView/store/LogStore";
import EnhanceEntranceModal from "../../common/enhanceEntrance/EnhanceEntranceModal";
import StatisticsStore from "../store/StatisticsStore";
import EnhanceEntranceSubMenuModal from "../../common/enhanceEntrance/EnhanceEntranceSubMenuModal";
const { Sider,Content } = Layout;
const StatisticsContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const {selectKey} = StatisticsStore
    const { route } = props;

    const path = props.match.path;
    return (<Provider {...store}>
            <Layout className="log">
                <Sider className="site-layout-background">
                    <StatisticsAside />
                </Sider>

                <Layout className="log-content" style={{position:"relative"}}>

                        {
                            (selectKey === "/statistics/log/projectuser" || selectKey === "/statistics/log/projectwork" || selectKey === "/statistics/log/userproject" ||
                             selectKey === "/statistics/projectSet/workItem" || selectKey === "/statistics/projectSet/projectProgress" || selectKey === "/statistics/workItem/completeTrend" ||
                             selectKey === "/statistics/workItem/workItemTrend" || selectKey === "/statistics/workItem/overview") &&
                            <EnhanceEntranceSubMenuModal
                                config={{title:"更多的统计类型", desc:"全面统计各项任务与项目工时，精准量化工作投入、核算成本并优化资源分配。"}}
                            />
                        }
                        <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                            {renderRoutes(route.routes)}
                        </Col>

                </Layout>
            </Layout>
        </Provider>

    )
}
export default withRouter(observer(StatisticsContent));