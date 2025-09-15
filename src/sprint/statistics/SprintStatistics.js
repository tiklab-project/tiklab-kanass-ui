/*
 * @Descripttion: 迭代统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-29 19:04:53
 */
import React, {Fragment, useState} from "react";
import SprintStatisticsAside from "./SprintStatisticsAside";
import { Layout, Row, Col } from 'antd';
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router";
import "../../project/statistics/components/Statistics.scss"
import EnhanceEntranceSubMenuModal from "../../common/enhanceEntrance/EnhanceEntranceSubMenuModal";
const { Sider } = Layout;
const SprintStatistics = (props) => {
    const route = props.route
    const [selectKey, setSelectKey] = useState("overview")
    return (
        <Layout className="statistics">
            <Sider trigger={null}>
                <SprintStatisticsAside
                    {...props}
                    selectKey={selectKey}
                    setSelectKey={setSelectKey}
                />
            </Sider>

            <Layout className="statistics-content" style={{ background: "#fff" }}>
                <Row style={{position: "relative"}}>
                    {
                        (selectKey !== "overview" && selectKey !== "workItem") &&
                        <EnhanceEntranceSubMenuModal
                            config={{title:"更多的事项、日志统计", desc:"全面统计各项任务与项目工时，精准量化工作投入、核算成本并优化资源分配。"}}
                        />
                    }
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>
        </Layout>


    // <Layout className="statistics">
    //     <Layout className="statistics-content" style={{ background: "#fff" }}>
    //         <Row>
    //             <Col sm={1} md={21} lg={{ span: 1 }} xl={{ span: "1", offset: "1" }} xxl={{ span: "1", offset: "3" }}>
    //                 <SprintStatisticsAside
    //                     {...props}
    //                 />
    //             </Col>
    //             <Col sm={23} md={23} lg={{ span: 23 }} xl={{ span: "19", offset: "2" }} xxl={{ span: "17", offset: "0" }}>
    //                 {renderRoutes(route.routes)}
    //             </Col>
    //         </Row>
    //     </Layout>
    // </Layout>
    )

}
export default withRouter(SprintStatistics);  