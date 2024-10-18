/*
 * @Descripttion: 敏捷开发项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 15:19:17
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Empty, Spin } from 'antd';
import ProdeAside from "./ProjectDetailAside";
import "./ProjectLayout.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject, Provider } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import ProjectStore from "../../project/store/ProjectStore";
import WorkStore from "../../../work/store/WorkStore";
import ProjectEmpty from "../../../common/component/ProjectEmpty";

const ProjectLayout = (props) => {
    const store = {
        projectStore: ProjectStore
    }
    const { route, systemRoleStore } = props;
    const [loading, setLoading] = useState(true)
    const { searchpro, findProjectList, project, setProject } = ProjectStore;
    const { setSearchConditionNull, setTabValue } = WorkStore;
    // 项目id
    const projectId = props.match.params.id;
    const [isShowText, SetIsShowText] = useState(false)
    useEffect(() => {
        /**
         * 从信息页面跳入项目详情页面时，获取项目id
         */
        setLoading(true)
        searchpro(projectId).then(res => {
            setLoading(false)
            if (res.code === 0) {
                localStorage.setItem("project", JSON.stringify(res.data));
                setProject(res.data)
                const isPublish = res.data?.projectLimits === "0" ? true : false;
                systemRoleStore.getInitProjectPermissions(getUser().userId, projectId, isPublish)
            }
        })

        //获取项目列表
        findProjectList()
        setSearchConditionNull()
        // 重置
        setTabValue({id: "all", type: "system"})
        return () => {
            setSearchConditionNull()
            setTabValue({id: "all", type: "system"})
            // localStorage.removeItem("project")
        }
    }, [projectId])


    return (
        <Provider {...store}>
            <Spin spinning={loading} tip="加载中..." >
            {
                project ? <Layout className="project-prodetail">
                    <ProdeAside
                        projectName={"项目1"}
                        project={project}
                        searchpro={searchpro}
                        isShowText = {isShowText} 
                        SetIsShowText = {SetIsShowText}
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
                :
                <div className="project-empty">
                    <ProjectEmpty description="没有该项目或者项目被删除" />
                </div>
                
            }
            </Spin>
           

        </Provider>

    )

}
export default inject("systemRoleStore")(observer(ProjectLayout));