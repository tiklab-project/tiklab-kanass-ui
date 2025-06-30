import {withRouter} from "react-router";
import React from "react"
import {Col, Form, Row, Select} from "antd";
import UserWorkItem from "../project/UserWorkItem";
import ProjectSetMember from "../projectSet/ProjectSetMember";
import ProjectSetWorkItem from "../projectSet/ProjectSetWorkItem";
import WorkItemTrend from "../workItem/WorkItemTrend";
import CompleteWorkItemTrend from "../workItem/CompleteWorkItemTrend";
import NewWorkItemTrend from "../workItem/NewWorkItemTrend";
import "./StatisticsOverview.scss";

const StatisticsOverview = (props) =>{
    return(
        <div className="statistics-overview">
            <div className="statistics-top">
                <div  className="statistics-work-title">概览</div>
            </div>
            <Row className="statistics-row">
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <UserWorkItem noEdit={true}/>
                </Col>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <ProjectSetMember noEdit={true}/>
                </Col>

            </Row>
            <Row className="statistics-row">
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <NewWorkItemTrend noEdit={true}/>
                </Col>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <CompleteWorkItemTrend noEdit={true}/>
                </Col>

            </Row>
            <Row className="statistics-row">
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <ProjectSetWorkItem noEdit={true}/>
                </Col>
                <Col sm={12} md={12} lg={{ span: 12 }} xl={{ span: "11", offset: "1" }} xxl={{ span: "11", offset: "1" }}>
                    <WorkItemTrend noEdit={true}/>
                </Col>
            </Row>
        </div>
    )
}
export default withRouter(StatisticsOverview)