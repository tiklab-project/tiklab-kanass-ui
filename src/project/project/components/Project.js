/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 13:36:22
 */
import React, { Fragment, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import Procontent from "./ProjectContent";
import ProjectGide from "./ProjectGide"
import "../components/project.scss";
import { observer, inject } from "mobx-react";
import { getUser } from 'tiklab-core-ui';
const Project = (props) => {
    const { projectStore } = props;
    const userId = getUser().userId;
    const { findJoinProjectList, prolist } = projectStore;
    useEffect(() => {
        findJoinProjectList({ creator: userId });
    }, [])
    return (
        <div className="project">
            <Layout className="project-content">
                <Row>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                        {
                            prolist && prolist.length > 0 ?
                            <Procontent /> : <ProjectGide /> 
                        }
                    </Col>
                </Row>
            </Layout>
        </div>

    )
}
export default inject('projectStore')(observer(Project));