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
import ProdeNomalAside from "../components/projectNomalDetailAside";
import ProdeScrumAside from "../components/projectScrumDetailAside";
import "../components/projectDetail.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import { SYSTEM_ROLE_STORE } from "doublekit-privilege-ui";

const ProjectDetail = (props) => {
    const { proStore, route } = props;
    const { searchpro, getProlist, prolist } = proStore;

    const projectId = localStorage.getItem("projectId")

    const [projectname, setProjectname] = useState();
    const [projectIcon, setProjectIcon] = useState();
    const [projectType, setProjectType] = useState();

    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if (search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        // searchpro(localStorage.getItem("projectId")).then((res) => {
        //     setProjectname(res.projectName)
        //     setProjectIcon(res.iconUrl)
        //     setProjectType(res.projectType.name)
        // })

        //获取项目列表
        getProlist()

        // 初始化权限
        // getInitProjectPermissions(getUser().userId, localStorage.getItem("projectId"))
        return
    }, [projectId])


    return (
        <Layout className="dath-prodetail">
            {
                localStorage.getItem("projectTypeId") === "0" ?
                    <ProdeScrumAside
                        projectName={"项目1"}
                        prolist={prolist}
                        searchpro={searchpro}
                        projectIcon={"dddd"}
                        projectType={"项目"}
                        {...props}
                    /> :
                    <ProdeNomalAside
                        projectName={"项目1"}
                        prolist={prolist}
                        searchpro={searchpro}
                        projectIcon={"dddd"}
                        projectType={"项目"}
                        {...props}
                    />
            }
            <Layout className="prodetail-content">
                <Row justify="start">
                    <Col xs={{ span: 24}} lg={{ span: 24}}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>


        </Layout>
    )

}
export default inject(SYSTEM_ROLE_STORE, 'proStore')(observer(ProjectDetail));