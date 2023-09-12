/*
 * @Descripttion: 首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import "./HomePage.scss";
import { Row, Col } from 'antd';
import { withRouter } from 'react-router';
import HomeSurvey from "./HomeSurvey";
const Home = (props) => {

    return (
        <Row className="home" >
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <HomeSurvey />
            </Col>
        </Row>
    );
}


export default withRouter(inject("homeStore")(observer(Home)));