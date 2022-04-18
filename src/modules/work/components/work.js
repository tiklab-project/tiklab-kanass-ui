/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-16 17:13:34
 */
import React, {useEffect, useState} from 'react';
import WorkAside from "./workFilterAside";
import { Layout,Row,Col } from 'antd';
import { renderRoutes } from "react-router-config";
import "./work.scss";
const { Sider } = Layout;
const WorkAll=(props)=>{
    //初始化获取项目列表
    const [route,setRoute]=useState({})
    useEffect(() => {
        setRoute(props.route)
    }, [])
    
    return (
        <div className="project">
            <Layout>
                <Sider>
                    <WorkAside></WorkAside>
                </Sider>
                <Layout style={{background: "#fff"}}>
                    <Row style={{height: "100%"}}>
                        <Col className="prodetail-content-col" xl={{span: 18,offset:3}} lg={{span: 20,offset:2}}>
                            {renderRoutes(route.routes)}
                        </Col>
                    </Row>
                </Layout>
            </Layout>
        </div>

    )
}

export default WorkAll;