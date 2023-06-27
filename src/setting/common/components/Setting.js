/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 17:51:33
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Layout } from 'antd';
import SetAside from "./SetAside";
import "../components/Orga.scss"
import { renderRoutes } from "react-router-config";
import {SystemNav} from "tiklab-privilege-ui";
import {setDevRouter, setPrdRouter}  from "./SetRouter"
const { Sider, Content } = Layout;
const Setting = (props) => {
    const route = props.route;
    const [router,setRouterMenu] = useState(setDevRouter);
    useEffect(() => {
        if (env === "local") {
            setRouterMenu(setDevRouter)
        }
        if (env !== "local") {
            setRouterMenu(setPrdRouter)
        }
        return 
    },[])
    return (
        <Fragment>
            <SystemNav
                {...props}
                applicationRouters={router} // 菜单
                outerPath={"/index/setting"} // 系统设置Layout路径
                notFoundPath={""}  //找不到页面路径
            >
                <Layout className="orga">
                    <Sider width={200} className="site-layout-background">
                        <SetAside {...props}></SetAside>
                    </Sider>

                    <Content
                        className="orga-background"
                    >
                        {renderRoutes(route.routes)}
                    </Content>
                </Layout>
            </SystemNav>
        </Fragment>

    )
}

export default Setting;