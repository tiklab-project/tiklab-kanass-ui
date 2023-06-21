import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject, Provider } from "mobx-react";
import WorkStore from '../store/WorkStore';
const WorkDetailPage = (props) => {
    const store = {
        workStore: WorkStore
    }
    const detailRef = useRef()


    return (<Provider {...store}>
        <Row style={{ height: "100%", overflow: "auto" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                <WorkDetail detailRef={detailRef} {...props} showPage = {true} />
            </Col>
        </Row>
    </Provider>
        
    );
};

export default observer(WorkDetailPage);