import {withRouter} from "react-router";
import {Layout} from "antd";
import {inject, observer, Provider} from "mobx-react";
import {renderRoutes} from "react-router-config";
import React from "react";
import LogStatisticsAside from "./LogStatisticsAside";
import "./LogStatisticsLayout.scss"
const { Sider,Content } = Layout;

const LogStatisticsLayout = (props) => {

    const { route } = props;

    return (
        <div>
            <Layout className="log">
                <Sider width={200} className="site-layout-background">
                    <LogStatisticsAside />
                </Sider>

                <Layout className="log-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Layout>
        </div>
    );
};

export default withRouter(inject('logStore')(observer(LogStatisticsLayout)));