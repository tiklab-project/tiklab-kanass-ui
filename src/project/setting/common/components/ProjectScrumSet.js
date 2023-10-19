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
import ProdeAside from "./ProjectScrumSetAside";
import "../components/projectSetDetail.scss";
import { renderRoutes } from "react-router-config";
import {observer, inject} from "mobx-react";

const ProjectScrumSet = (props)=>{
    const {projectStore,systemRoleStore,route} = props;
    const {searchpro, findProjectList, prolist} = projectStore;

    // 当前项目名字
    const [projectname,setProjectname] = useState();

    // 获取当前项目id
    const projectId = props.match.params.id;


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if(search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        searchpro(props.match.params.id).then((res)=> {
            setProjectname(res.projectName)
        })
       
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
            <Layout>
                {renderRoutes(route.routes)}
            </Layout>
            
        </Layout>
    )
    
}
export default inject('projectStore')(observer(ProjectScrumSet));