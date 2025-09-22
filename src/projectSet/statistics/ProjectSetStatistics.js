/*
 * @Descripttion: 项目集统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, {Fragment, useState} from "react";
import ProjectSetStatisticsAside from "./ProjectSetStatisticsAside";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";
import "../../project/statistics/components/Statistics.scss";
import EnhanceEntranceSubMenuModal from "../../common/enhanceEntrance/EnhanceEntranceSubMenuModal";
const { Sider } = Layout;
const ProjectSetStatistics = (props) => {
    const route = props.route
    const [selectKey, setSelectKey] = useState("overview")
    return (
        <Layout className="statistics">
            <Sider trigger={null}>
                <ProjectSetStatisticsAside
                    {...props}
                    selectKey={selectKey}
                    setSelectKey={setSelectKey}
                />
            </Sider>

            <Layout className="statistics-content" style={{ background: "#fff" }}>
                <Row style={{position:"relative"}}>
                    {
                        (selectKey !== "overview" && selectKey !== "workItem") &&
                        <EnhanceEntranceSubMenuModal
                            config={{title:"更多的统计类型", desc:"全面统计各项任务与项目工时，精准量化工作投入、核算成本并优化资源分配。"}}
                        />
                    }
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>
        </Layout>
    )

}
export default withRouter(ProjectSetStatistics);