/*
 * @Descripttion: 项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-07 15:07:14
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from 'antd';
import ProdeAside from "./ProjectScrumSetAside";
import "../components/projectSetDetail.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import { ProjectNav } from "tiklab-privilege-ui";
import { useTranslation } from "react-i18next";
import { getUser } from "tiklab-core-ui";

const ProjectScrumSet = (props) => {
    const { projectStore, systemRoleStore, route } = props;
    const { searchpro, findProjectList, prolist } = projectStore;
    const { t } = useTranslation();
    // 当前项目名字
    const [projectname, setProjectname] = useState();

    // 获取当前项目id
    const projectId = props.match.params.id;


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if (search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        searchpro(props.match.params.id).then((res) => {
            setProjectname(res.projectName)
        })
        systemRoleStore.getInitProjectPermissions(getUser().userId, projectId)
        return
    }, [projectId])

    const prorouter = [
        {
            title: `${t('projectInfo')}`,
            icon: 'survey',
            id: `/project/${projectId}/set/basicInfo`,
            encoded: "Survey",
        },
        {
            title: "事项类型",
            icon: 'survey',
            id: `/project/${projectId}/set/projectWorkType`,
            encoded: "WorkType",
            purviewCode: "ProjectWorkType",
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            id: `/project/${projectId}/set/user`,
            encoded: "User",
            purviewCode: "ProjectUser"
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            id: `/project/${projectId}/set/projectDomainRole`,
            encoded: "Privilege",
            purviewCode: "ProjectPrivilege"
        },
        {
            title: "流程",
            icon: 'survey',
            id: `/project/${projectId}/set/projectFlow`,
            encoded: "WorkFlow",
            purviewCode: "ProjectFlow"
        },
        {
            title: "表单",
            icon: 'survey',
            id: `/project/${projectId}/set/projectForm`,
            encoded: "WorkForm",
            purviewCode: "ProjectForm"
        },
        {
            title: `${t('module')}`,
            icon: 'survey',
            id: `/project/${projectId}/set/module`,
            encoded: "Module",
            purviewCode: "ProjectModule"
        },
        {
            title: `消息通知方案`,
            icon: 'survey',
            id: `/project/${projectId}/set/messagenotice`,
            encoded: "messagenotice",
            purviewCode: "ProjectMessagenotice"
        }
    ];
    return (
        <Layout className="project-set">
            {/* <ProjectNav
                {...props}
                projectRouters={prorouter}
                domainId={projectId}
                outerPath={`/project/${projectId}/set`}
                noAccessPath={`/project/${projectId}/set/noaccess`} //没有资源访问权限页面的路由参数
            > */}
                <ProdeAside
                    projectName={projectname}
                    prolist={prolist}
                    prorouter = {prorouter}
                    searchpro={searchpro}
                    {...props}
                />
                <Layout>
                    {renderRoutes(route.routes)}
                </Layout>
            {/* </ProjectNav> */}


        </Layout>
    )

}
export default inject('projectStore', 'systemRoleStore')(observer(ProjectScrumSet));