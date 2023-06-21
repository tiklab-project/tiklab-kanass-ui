import React, { useEffect } from "react";
import "../components/ProjectSetLayout.scss"
import { Layout, Row, Col } from 'antd';
import ProjectSetDetailAside from "./ProjectSetDetailAside";
import { renderRoutes } from "react-router-config";
import ProjectSetStore from "../../projectSet/store/ProjectSetStore"
import { Provider } from "mobx-react";
const ProjectSetDetail = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    const { route } = props;

    return (<Provider {...store}>
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
        </Layout >
    </Provider>




    )
}
export default ProjectSetDetail;