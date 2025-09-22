/*
 * @Descripttion: 日志页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 09:43:27
 */
import React, { useEffect, useState } from "react";
import { observer, Provider } from "mobx-react";
import {Col, Layout, Row, Tooltip,} from 'antd';
import "./Log.scss"
import LogStore from "../logView/store/LogStore";
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import LogAside from "./LogAside";
import Breadcrumb from "../../common/breadcrumb/Breadcrumb";
import EnhanceEntranceCloseModal from "../../common/enhanceEntrance/EnhanceEntranceCloseModal";
import {QuestionCircleOutlined} from "@ant-design/icons";
import EnhanceEntranceSubMenuModal from "../../common/enhanceEntrance/EnhanceEntranceSubMenuModal";
import {disableFunction} from "tiklab-core-ui"
const { Sider,Content } = Layout;
const LogContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const { route } = props;
    const [selectTab, setSelectTab] = useState("list");
    const [enhanceModal, setEnhanceModal] = useState( false);
    const [selectKey, setSelectKey] = useState("/log/list");
    const disable = disableFunction();
    const path = props.location.pathname;

    const logTabs = [
        {
            title: "工时日志",
            id: `/log/list`,
            key: "list",
            encoded: "list",
        },
        {
            title: "工时统计",
            id: `/log/statistics`,
            key: "statistics",
            encoded: "statistics",
        }
    ];

    const handleTabClick = (key, id) => {
        // if (key === "statistics"){
        //     setEnhanceModal(true)
        // }else {
        //     setSelectTab(key)
        //     props.history.push(id)
        // }

        if (key === "statistics" && disable){
            setSelectTab(key)
            setSelectKey(id)
            props.history.push(id)
        }else {
            setSelectTab(key)
            setSelectKey(id)
            props.history.push(id)
        }

    }

    const goDocument = () => {
        window.open('https://doc.tiklab.net/document', '_blank');
    }

    return (<Provider {...store}>
        <Layout className="log">
            {/*<Sider width={200} className="site-layout-background">*/}
            {/*    <LogAside />*/}
            {/*</Sider>*/}

            <Row style={{
                borderBottom: "1px solid var(--tiklab-gray)"
                // backgroundColor: "var(--tiklab-gray)"
            }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                    <div style={{
                        padding: "0px 20px",
                        display: "flex",
                        alignItems: "center",
                        // gap: "60px",
                        lineHeight: "55px"
                    }}>
                        <Breadcrumb firstText={"工时"}/>
                        <div className="log-top-tabs">
                            {
                                logTabs.map(item => {
                                    return <div
                                        className={`log-tab ${item.key === selectTab ? "log-tab-active" : ""}`}
                                        key={item.key}
                                        onClick={() => handleTabClick(item.key, item.id)}
                                    >
                                        <span>{item.title}</span>
                                    </div>
                                })
                            }
                        </div>
                        <div>
                            <Tooltip title={"帮助"}>
                                <QuestionCircleOutlined
                                    style={{
                                        fontSize: "18px",
                                        cursor: "pointer"
                                    }}
                                    onClick={goDocument}
                                />
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row style={{position:"relative"}}>
                {
                    (selectKey === "/log/statistics/projectuser" || selectKey === "/log/statistics/projectwork" || selectKey === "/log/statistics/userproject" ||
                        selectKey === "/log/statistics" ||
                        path === "/log/statistics/projectuser" || path === "/log/statistics/projectwork" || path === "/log/statistics/userproject" ||
                        path === "/log/statistics"
                    ) &&
                    <EnhanceEntranceSubMenuModal
                        config={{title:"更多的统计类型", desc:"全面统计各项任务与项目工时，精准量化工作投入、核算成本并优化资源分配。"}}
                    />
                }
                <Layout className="log-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Row>
        </Layout>
        {/*<EnhanceEntranceCloseModal*/}
        {/*    enhanceModal = {enhanceModal}*/}
        {/*    setEnhanceModal={setEnhanceModal}*/}
        {/*    config={{title:"工时统计", desc:"工时统计"}}*/}
        {/*/>*/}
    </Provider>

    )
}
export default withRouter(observer(LogContent));