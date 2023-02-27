/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 17:51:33
 */
import React,{Fragment} from 'react';
import {observer, inject} from "mobx-react";
import { Layout,Col,Row  } from 'antd';
import  SetAside from "../components/SetAside";
import "../components/Orga.scss"
import { renderRoutes } from "react-router-config";
const { Sider,Content } = Layout;
const Setting = (props) => {
    const route = props.route
    return(
        <Fragment>      
            <Layout className="orga">
                <Sider width={200} className="site-layout-background">
                    <SetAside></SetAside>
                </Sider>
                
                <Content
                    className="orga-background"
                >
                    {renderRoutes(route.routes)}
                </Content>
            </Layout>
        </Fragment>
        
    )
}

export default Setting;