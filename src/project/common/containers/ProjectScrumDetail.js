/*
 * @Descripttion: 项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 15:19:17
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from 'antd';
import ProdeScrumAside from "../components/ProjectScrumDetailAside";
import "../components/ProjectDetail.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";

const ProjectScrumDetail = (props) => {
    const { projectStore, route, systemRoleStore } = props;
    const { searchpro, findProjectList, prolist } = projectStore;

    const projectId = props.match.params.id;
    const [project, setProject] = useState();

    useEffect(() => {
        searchpro(projectId).then(res => {
            if(res.code === 0) {
                localStorage.setItem("project", JSON.stringify(res.data));
                setProject(res.data)
                const isPublish = res.data?.projectLimits === "0" ? true : false
                systemRoleStore.getInitProjectPermissions(getUser().userId, props.match.params.id, isPublish)
            }
        })
        
        //获取项目列表
        findProjectList()
        return
    }, [])


    return (
        <Layout className="project-prodetail">
            <ProdeScrumAside
                projectName={"项目1"}
                prolist={prolist}
                project= {project}
                searchpro={searchpro}
                {...props}
            />
            <Layout className="prodetail-content">
                <Row justify="start" className="prodetail-row">
                    <Col xs={{ span: 24}} lg={{ span: 24}}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>
        </Layout>
    )

}
export default inject("systemRoleStore", 'projectStore')(observer(ProjectScrumDetail));