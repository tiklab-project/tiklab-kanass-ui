/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 17:51:33
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Col, Layout, Row } from 'antd';
import SetAside from "./SetAside";
import "../components/Orga.scss"
import { renderRoutes } from "react-router-config";
import { SystemNav } from "thoughtware-privilege-ui";
import { setDevRouter, setPrdRouter } from "./SetRouter"
const { Sider, Content } = Layout;
const Setting = (props) => {
    const route = props.route;
    const [router, setRouterMenu] = useState(setDevRouter);
    useEffect(() => {
        if (env === "local") {
            setRouterMenu(setDevRouter)
        }
        if (env !== "local") {
            setRouterMenu(setPrdRouter)
        }
        return
    }, [])
    const commonRouter  = route.routes.filter(item => item.row === true)
    const selfRouter  = route.routes.filter(item => item.row !== true)
    return (
        <Fragment>
            <SystemNav
                {...props}
                applicationRouters={router} // 菜单
                outerPath={"/setting"} // 系统设置Layout路径
                notFoundPath={""}  //找不到页面路径
            >
                <Layout className="orga">
                    <Sider width={200} className="site-layout-background">
                        <SetAside {...props}></SetAside>
                    </Sider>

                    <Content
                        className="orga-background"
                    >   
                        {renderRoutes(commonRouter)}
                        <Row style={{height: "calc(100vh - 49px)"}}>
                            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                                {renderRoutes(selfRouter)}
                            </Col>
                        </Row>

                    </Content>
                </Layout>
            </SystemNav>
        </Fragment>

    )
}

export default Setting;