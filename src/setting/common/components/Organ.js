/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 17:51:33
 */
import React,{Fragment} from 'react';
import { Layout,Col,Row  } from 'antd';
import  OrgaAside from "./OrgaAside";
import "../components/Orga.scss"
const { Sider,Content } = Layout;
const Organ = (props) => {
    return(
        <Fragment>      
            <Layout className="orga">
                <Sider width={200} className="site-layout-background">
                    <OrgaAside></OrgaAside>
                </Sider>
                
                {/* <Content
                    className="orga-background"
                >
                    {renderRoutes(route.routes)}
                </Content> */}
            </Layout>
        </Fragment>
        
    )
}

export default Organ;