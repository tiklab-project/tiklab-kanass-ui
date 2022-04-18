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
import  OrgaAside from "../components/orgaAside";
import "../components/orga.scss"
import { renderRoutes } from "react-router-config";
const { Sider,Content } = Layout;
const Orga = (props) => {
    const route = props.route
    return(
        <Fragment>      
            <Layout className="orga">
                <Sider width={200} className="site-layout-background">
                    <OrgaAside></OrgaAside>
                </Sider>
                
                <Content
                    className="orga-background"
                >
                    {/* <Row style={{height: "100%"}}>
                        <Col xl={{span: 18,offset:3}} lg={{span: 20,offset:2}} style={{padding: "10px"}} className="orga-col"> */}
                            {renderRoutes(route.routes)}
                        {/* </Col>
                    </Row> */}
                </Content>
            </Layout>
        </Fragment>
        
    )
}

export default Orga;