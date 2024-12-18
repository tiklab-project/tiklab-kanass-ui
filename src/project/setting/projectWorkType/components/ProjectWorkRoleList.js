import React from "react";
import WorkRoleList from "../../../../setting/workPrivilege/components/WorkRoleList";
import { Col, Row } from "antd";


const ProjectWorkRoleList = (props) => {
    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <WorkRoleList />
            </Col>
        </Row>

    )
}

export default ProjectWorkRoleList;