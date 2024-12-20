/*
 * @Author: 袁婕轩
 * @Date: 2024-12-13 17:22:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:32:37
 * @Description: 项目角色功能列表
 */

import React from "react";
import WorkRoleFunction from "../../../../setting/workPrivilege/components/WorkRoleFunction";
import { Col, Row } from "antd";


const ProjectWorkRoleFunction = (props) => {
    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <WorkRoleFunction />
            </Col>
        </Row>

    )
}

export default ProjectWorkRoleFunction;