/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:29:19
 * @Description: 项目的事项权限
 */
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