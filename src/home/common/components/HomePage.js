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
import "../components/HomePage.scss";
import { Row, Col } from 'antd';
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
const Home = (props) => {
    const { route, insightStore, homeStore } = props;
    const { findInsightList } = insightStore;
    const { activeKey, setActiveKey } = homeStore;
    // 仪表盘地址
    const [insightUrl, setInsightUrl] = useState('/index/home/insight/list')
    // 当前url
    const path = props.location.pathname;

    useEffect(() => {
        getInsightUrl()

        if (path.indexOf("survey") > -1) {
            setActiveKey("survey")
        }

        if (path.indexOf("insight") > -1) {
            setActiveKey("insight")
        }

        if (path.indexOf("todoList") > -1) {
            setActiveKey("todoList")
        }
    }, [])

    /**
     * 获取仪表盘跳转的url 地址，
     * 若有仪表盘，则设置跳转到列表第一个详情
     */
    const getInsightUrl = () => {
        findInsightList().then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    setInsightUrl(`/index/home/insight/viewInsight/${res.data[0].id}`)
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
        props.history.push(url)
        setActiveKey(activeKey)
    }

    return (
        <Row className="home" >
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="home-tab">
                    <div className={`home-tab-item ${activeKey === "survey" ? "home-tab-select" : ""}`} key={1} onClick={() => selectRouter("/index/home/survey", "survey")}>概况</div>
                    <div className={`home-tab-item ${activeKey === "todoList" ? "home-tab-select" : ""}`} key={2} onClick={() => selectRouter("/index/home/todoList", "todoList")}>待办</div>
                    <div className={`home-tab-item ${activeKey === "insight" ? "home-tab-select" : ""}`} key={3} onClick={() => selectRouter(insightUrl, "insight")}>仪表盘</div>
                </div>
                {renderRoutes(route.routes)}
            </Col>
        </Row>
    );
}


export default withRouter(inject("insightStore", "homeStore")(observer(Home)));