/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 13:36:22
 */
import React, { Fragment, useEffect } from 'react';
import Proaside from "../components/projectAside";
import { Layout, Row, Col } from 'antd';
import Procontent from "../components/projectContent";
import ProjectGide from "../components/projectGide"
import "../components/project.scss";
import { observer, inject } from "mobx-react";
const { Sider } = Layout;

const Project = (props) => {
    const { proStore } = props;
    const { getProlist,prolist} = proStore;
    //初始化获取项目列表
    useEffect(() => {
        getProlist()
    }, [])

    return (
        <div className="project">
            <Layout className="project-content">
                {prolist && prolist.length > 0 ? <Fragment>
                    <Sider>
                        <Proaside></Proaside>
                    </Sider>
                    <Layout className="project-table">
                        {/* <Row>
                            <Col> */}
                            <Procontent />
                            {/* </Col>
                        </Row> */}
                    </Layout>
                </Fragment>: <ProjectGide />
                }
            </Layout>
        </div>

    )
}
export default inject('proStore')(observer(Project));