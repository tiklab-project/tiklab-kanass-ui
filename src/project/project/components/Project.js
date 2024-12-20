/*
 * @Descripttion: 项目
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 16:53:12
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Layout, Row, Col, Spin } from 'antd';
import ProjectList from "./ProjectList";
import ProjectGide from "./ProjectGide"
import { observer, Provider } from "mobx-react";
import ProjectStore from "../store/ProjectStore"
const Project = (props) => {
    const store = {
        projectStore: ProjectStore
    }
    const [loading, setLoading] = useState(true)
    const orderParams = [{
        name: "startTime",
        orderType: "desc"
    }]
    const { findMyAllProjectList, allProlist } = ProjectStore;
    useEffect(() => {
        setLoading(true)
        findMyAllProjectList({ orderParams: orderParams }).then(res => {
            setLoading(false)
        })
        return;
    }, [])
    return (
        <Provider {...store}>
            <div className="project">
                <Layout className="project-content">
                    <Row>
                        <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                            {
                                allProlist && allProlist.length > 0 ?
                                    <ProjectList /> :
                                    <>
                                        {
                                            !loading && <ProjectGide />
                                        }
                                    </>
                            }
                        </Col>
                    </Row>
                </Layout>
            </div>
        </Provider>


    )
}
export default observer(Project);