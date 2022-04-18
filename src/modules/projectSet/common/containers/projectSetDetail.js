/*
 * @Descripttion: 项目详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-07 15:07:14
 */
import React, { useState,useEffect } from "react";
import { Layout,Row,Col } from 'antd';
import ProdeAside from "../components/projectSetDetailAside";
import "../components/projectSetDetail.scss";
import { renderRoutes } from "react-router-config";
import {observer, inject} from "mobx-react";
import {SYSTEM_ROLE_STORE} from "doublekit-privilege-ui"
import {getUser} from 'doublekit-core-ui'

const ProjectSetDetail = (props)=>{
    const {proStore,systemRoleStore,route} = props;
    const {searchpro, getProlist, prolist} = proStore;
    const {getInitProjectPermissions} = systemRoleStore;

    // 当前项目名字
    const [projectname,setProjectname] = useState();

    // 获取当前项目id
    const projectId = localStorage.getItem("projectId")


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if(search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        searchpro(localStorage.getItem("projectId")).then((res)=> {
            setProjectname(res.projectName)
        })
        //获取项目列表
        getProlist()
        // 初始化权限
        getInitProjectPermissions(getUser().userId, localStorage.getItem("projectId"))
        return 
    }, [projectId])


    return (
        <Layout className="project-set">
            <ProdeAside 
                projectName={projectname}
                prolist={prolist} 
                searchpro = {searchpro} 
                {...props}
            />
            <Layout className="project-set-content">
                <Row style={{height: "100%"}}>
                    <Col className="project-set-content-col" xl={{span: 18,offset:3}} lg={{span: 20,offset:2}}>
                        {renderRoutes(route.routes)}
                    </Col>
                </Row>
            </Layout>
            
        </Layout>
    )
    
}
export default inject(SYSTEM_ROLE_STORE,'proStore')(observer(ProjectSetDetail));