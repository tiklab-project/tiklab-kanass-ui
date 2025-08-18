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
import { SystemNav } from "tiklab-privilege-ui";
import { setDevRouter, setPrdRouter } from "./SetRouter";
import { getUser } from 'tiklab-core-ui';
import { inject, observer } from 'mobx-react';
import EnhanceEntranceModal from "../../../common/enhanceEntrance/EnhanceEntranceModal";
import SettingHomeStore from "../../home/store/SettingHomeStore";
// import { UserVerify } from 'tiklab-user-extension-ui';
const { Sider, Content } = Layout;
const Setting = (props) => {
    const { systemRoleStore } = props;
    const { selectKey } = SettingHomeStore;
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

    const user = getUser();

    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }
        return;
    }, [])
    const commonRouter = route.routes.filter(item => item.row === true)
    const selfRouter = route.routes.filter(item => item.row !== true)
    return (
        <Fragment>
            <SystemNav
                {...props}
                applicationRouters={router}
                outerPath={"/setting"}
                noAccessPath={"/noaccess"} //没有资源访问权限页面的路由参数
            >
                <Layout className="orga">
                    <Sider width={200} className="site-layout-background">
                        <SetAside {...props}></SetAside>
                    </Sider>

                    <Content
                        className="orga-background"
                    >
                        {renderRoutes(commonRouter)}
                        <Row style={{
                            height: "calc(100% - 49px)",
                            // position: "relative"
                        }}>
                            {
                                selectKey === "/setting/logo" &&
                                <EnhanceEntranceModal
                                    config={{title:"自定义LOGO", desc:"允许替换系统默认的LOGO图片，实现品牌个性化展示"}}
                                />
                            }
                            {
                                selectKey === "/setting/ipRoster" &&
                                <EnhanceEntranceModal
                                    config={{title:"IP黑白名单", desc:"允许或禁止特定IP地址访问系统，实现网络访问控制"}}
                                />
                            }

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

// export default inject("systemRoleStore")(observer(UserVerify(Setting,"/noAuth", "kanass")));
export default inject("systemRoleStore")(observer(Setting));

