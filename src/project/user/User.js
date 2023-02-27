/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React from "react";
import { DomainUserList } from 'tiklab-user-ui';
import { inject, observer } from "mobx-react";
import { Row, Col } from "antd";

const User = props => {
    const projectId = props.match.params.id;
    return (
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-user" style={{ paddingRight: "8px" }}>
                    <DomainUserList
                        {...props}
                        domainId={projectId}
                        bgroup = {"teamwire"}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default inject("domainUserStore")(observer(User));
