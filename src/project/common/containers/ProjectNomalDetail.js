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
import ProdeNomalAside from "../components/ProjectNomalDetailAside";
import "../components/ProjectDetail.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";

const ProjectNomalDetail = (props) => {
    const { projectStore, route, systemRoleStore } = props;
    const { searchpro, findProjectList, prolist } = projectStore;
    const projectId = props.match.params.id;
    const [project, setProject] = useState()

    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
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
            <ProdeNomalAside
                prolist={prolist}
                searchpro={searchpro}
                project={project}
                {...props}
            />
            <Layout className="prodetail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    )

}
export default inject("systemRoleStore", 'projectStore')(observer(ProjectNomalDetail));