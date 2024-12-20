/*
 * @Descripttion: 项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:57:01
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from 'antd';
import "../components/ProjectSetSettingDetailAside.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import ProjectSetSetDetailAdide from "./ProjectSetSettingDetailAside"
import { ProjectNav, SystemNav } from "tiklab-privilege-ui";
import { useTranslation } from "react-i18next";
import { getUser } from "tiklab-core-ui";

const ProjectSetting = (props) => {
    const { route, systemRoleStore } = props;
    const { t } = useTranslation();

    // 获取当前项目id
    const projectSetId = props.match.params.projectSetId;


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if (search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        // 初始化权限
        systemRoleStore.getInitProjectPermissions(getUser().userId, projectSetId)
        return
    }, [projectSetId])

    const prorouter = [
        {
            title: "项目集信息",
            icon: 'survey',
            id: `/projectSet/${projectSetId}/set/basicInfo`,
            encoded: "Survey",
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            id: `/projectSet/${projectSetId}/set/user`,
            encoded: "DominRole",
            purviewCode: "ProjectSetUser",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            id: `/projectSet/${projectSetId}/set/dominRole`,
            encoded: "User",
            purviewCode: "ProjectSetPrivilege",
        }
    ];

    return (
        <Layout className="projectSet-set">
            <ProjectNav
                {...props}
                projectRouters={prorouter}
                domainId = {projectSetId}
                outerPath={`/projectSet/${projectSetId}/set`}
                noAccessPath={`/projectSet/${projectSetId}/set/noaccess`} //没有资源访问权限页面的路由参数
            >
                <ProjectSetSetDetailAdide
                    {...props}
                    prorouter ={prorouter}
                />
                <Layout>
                    {renderRoutes(route.routes)}
                </Layout>
            </ProjectNav>


        </Layout>
    )

}
export default inject("systemRoleStore")(observer(ProjectSetting));