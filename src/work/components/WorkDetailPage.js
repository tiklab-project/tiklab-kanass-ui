import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkDetailPage = (props) => {
    const detailRef = useRef()


    return (
        <Row style={{ height: "100%", overflow: "auto" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                <WorkDetail detailRef={detailRef} {...props} showPage = {true} />
            </Col>
        </Row>
    );
};

export default inject("workStore")(observer(WorkDetailPage));