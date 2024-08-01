import React, { useEffect, useState } from "react";
import "../components/ProjectSetLayout.scss"
import { Layout, Row, Col } from 'antd';
import ProjectSetDetailAside from "./ProjectSetDetailAside";
import { renderRoutes } from "react-router-config";
import ProjectSetStore from "../../projectSet/store/ProjectSetStore"
import { Provider } from "mobx-react";
import HeaderCe from "../../../home/common/components/HeaderCe";
const ProjectSetDetail = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    const { route } = props;
    const [isShowText, SetIsShowText] = useState(false)
    return (<Provider {...store}>
        <Layout className="projectSet-detail">
            <ProjectSetDetailAside
                projectName={"项目1"}
                projectIcon={"dddd"}
                projectType={"项目"}
                isShowText = {isShowText} 
                SetIsShowText = {SetIsShowText}
                {...props}
            />
            <Layout className="prodetail-content">
                <HeaderCe 
                    isShowText = {isShowText} 
                    SetIsShowText = {SetIsShowText}
                />
                {/* <Row justify="start">
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}> */}
                        {renderRoutes(route.routes)}
                    {/* </Col>
                </Row> */}
            </Layout>
        </Layout >
    </Provider>




    )
}
export default ProjectSetDetail;