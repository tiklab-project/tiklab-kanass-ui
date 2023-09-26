/*
 * @Descripttion: 敏捷开发项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 15:19:17
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from 'antd';
import ProdeScrumAside from "./ProjectScrumDetailAside";
import "../components/ProjectLayout.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject, Provider } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import ProjectStore from "../../project/store/ProjectStore";
import WorkStore from "../../../work/store/WorkStore";
const ProjectScrumDetail = (props) => {
    const store = {
        projectStore: ProjectStore
    }
    const { route, systemRoleStore } = props;

    const { searchpro, findProjectList } = ProjectStore;
    const { setSearchConditionNull, setSearchType } = WorkStore;
    // 项目id
    const projectId = props.match.params.id;
    // 项目详情
    const [project, setProject] = useState();

    useEffect(() => {
        console.log(projectId)
        /**
         * 从信息页面跳入项目详情页面时，获取项目id
         */
        searchpro(projectId).then(res => {
            if (res.code === 0) {
                localStorage.setItem("project", JSON.stringify(res.data));
                setProject(res.data)
                const isPublish = res.data?.projectLimits === "0" ? true : false
                systemRoleStore.getInitProjectPermissions(getUser().userId, props.match.params.id, isPublish)
            }
        })

        //获取项目列表
        findProjectList()
        setSearchConditionNull()
        setSearchType("pending")
        return () => {
            setSearchConditionNull()
            setSearchType("pending")
        }
    }, [projectId])


    return (
        <Provider {...store}>
            {
                project && <Layout className="project-prodetail">

                    <ProdeScrumAside
                        projectName={"项目1"}
                        project={project}
                        searchpro={searchpro}
                        {...props}
                    />
                    <Layout className="prodetail-content">
                        <Row justify="start" className="prodetail-row">
                            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                {renderRoutes(route.routes)}
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            }

        </Provider>

    )

}
export default inject("systemRoleStore")(observer(ProjectScrumDetail));