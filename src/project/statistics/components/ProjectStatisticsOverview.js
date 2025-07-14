import {Button, Col, Form, Row, Select, Table} from "antd";
import React from "react";
import {withRouter} from "react-router";
import StatisticsStatusWork from "./StatisticsStatusWork";
import "./ProjectStatisticsOverview.scss"

const ProjectStatisticsOverview = (props) => {
    return(
        <div className="statistics-overview">
            <div className="statistics-overview-top" >
                <div className="statistics-overview-title">概览</div>
            </div>

            <Row className="project-statistics-row" style={{height:"auto"}}>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    {/*<div className="statistics-col-title">事项字段统计  统计项：状态</div>*/}
                    <StatisticsStatusWork index={0} statistical={'state'} noEdit={true} overviewTitle={"事项状态统计"}/>
                </Col>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    {/*<div className="statistics-col-title">事项字段统计  统计项：事项类型</div>*/}
                    <StatisticsStatusWork index={1} statistical={'workType'} noEdit={true} overviewTitle={"事项类型统计"}/>
                </Col>

            </Row>
            <Row className="project-statistics-row" style={{height:"auto"}}>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    {/*<div className="statistics-col-title">事项字段统计  统计项：创建人</div>*/}
                    <StatisticsStatusWork index={2} statistical={'builder'} noEdit={true} overviewTitle={"事项创建人统计"}/>
                </Col>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    {/*<div className="statistics-col-title">事项字段统计  统计项：负责人</div>*/}
                    <StatisticsStatusWork index={3} statistical={'assigner'} noEdit={true} overviewTitle={"事项负责人统计"}/>
                </Col>

            </Row>

        </div>
    )
};

export default withRouter(ProjectStatisticsOverview);