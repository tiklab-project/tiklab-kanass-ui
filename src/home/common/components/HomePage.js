
/*
 * @Descripttion: 首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { Fragment, useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import "./HomePage.scss";
import {Row, Col, Layout} from 'antd';
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import { CalendarOutlined, BarChartOutlined } from '@ant-design/icons';


/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Home = (props) => {
    const { route, insightStore, homeStore } = props;
    const { activeKey, setActiveKey, findInsightList } = homeStore;
    // 仪表盘地址
    const [insightUrl, setInsightUrl] = useState('/index/insightlist')
    // 当前url
    const path = props.location.pathname;

    useEffect(() => {
        getInsightUrl()

        // console.log(path)
        // if (path.includes("overview") > -1) {
        //     setActiveKey("overview")
        // }
        //
        // if (path.indexOf("insightlist") > -1 || path.indexOf("viewInsight") > -1) {
        //     setActiveKey("insight")
        // }
        //
        // if (path.indexOf("todoList") > -1) {
        //     setActiveKey("todoList")
        // }
        //
        // if (path.indexOf("todoList") > -1) {
        //     setActiveKey("todoList")
        // }
        return null;

    }, [])

    /**
     * 获取仪表盘跳转的url 地址，
     * 若有仪表盘，则设置跳转到列表第一个详情
     */
    const getInsightUrl = () => {
        findInsightList().then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    setInsightUrl(`/index/viewInsight/${res.data[0].id}`)
                }

            }
        })
    }

    /**
     * tab 切换
     * @param {地址} url
     * @param {tab key} activeKey
     */
    const selectRouter = (url, activeKey) => {
        setActiveKey(activeKey)
        props.history.push(url)
    }

    return (
        <div>
            <Row className="index-home" >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "21", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}>
                        <div className="index-home-tabs">

                            <div className={` index-home-tab ${activeKey === "overview" ? "index-home-tab-select" : ""}`}
                                 key={1}
                                 onClick={() => selectRouter("/index/overview", "overview")}>
                                概况</div>

                            <div className={` index-home-tab ${activeKey === "insight" ? "index-home-tab-select" : ""}`}
                                 key={3}
                                 onClick={() => selectRouter(insightUrl, "insight")}>
                                仪表盘</div>

                            <div className={` index-home-tab ${activeKey === "todoList" ? "index-home-tab-select" : ""}`}
                                 key={2}
                                 onClick={() => selectRouter("/index/todoList", "todoList")}>
                                待办</div>

                            <div className={` index-home-tab ${activeKey === "appraised" ? "index-home-tab-select" : ""}`}
                                 key={4}
                                 onClick={() => selectRouter("/index/appraised", "appraised")}>
                                评审</div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Layout className={"index-home-content"}>
                    {renderRoutes(route.routes)}
                </Layout>
            </Row>
        </div>
    );
}


export default withRouter(inject("homeStore")(observer(Home)));

