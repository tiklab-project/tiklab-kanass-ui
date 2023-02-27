import React, { useEffect } from "react";
import "../components/projectSetDetail.scss"
import { Layout, Row, Col } from 'antd';
import ProjectSetDetailAside from "../components/ProjectSetDetailAside";
import { renderRoutes } from "react-router-config";
const ProjectSetDetail = (props) => {
    const { route } = props;
    
    return (
        <Layout className="projectSet-detail">
            <ProjectSetDetailAside 
                 projectName={"项目1"}
                 projectIcon={"dddd"}
                 projectType={"项目"}
                 {...props}
            />
            <Layout className="prodetail-content">
                <Row justify="start">
                    <Col lg={{ span: 24 }}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>


        </Layout>
    )
}
export default ProjectSetDetail;