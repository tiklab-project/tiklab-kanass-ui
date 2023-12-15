/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-05 17:06:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:20:30
 */
import React from "react";
import { DomainRole } from 'thoughtware-privilege-ui';
import { inject, observer } from "mobx-react";
import { Row, Col } from "antd";

const ProjectDomainRole = props => {
    const projectId = props.match.params.id;

    return (
        // <Row>
        //     <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <DomainRole
                    {...props}
                    domainId={projectId}
                    bgroup = {"kanass"}
                />
        //     </Col>
        // </Row>
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectDomainRole));