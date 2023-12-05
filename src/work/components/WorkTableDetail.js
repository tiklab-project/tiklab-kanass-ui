/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:38:24
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkDetailDrawer = (props) => {
    const detailRef = useRef()


    return (
        <Row style={{ height: "100%", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                <WorkDetail detailRef={detailRef} {...props} showPage = {true} />
            </Col>
        </Row>
    );
};

export default inject("workStore")(observer(WorkDetailDrawer));