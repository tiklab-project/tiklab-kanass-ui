/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState, useRef } from "react";
import { inject, observer } from "mobx-react";
import { Layout } from "antd";
import "../components/SprintDetail.scss";
import { renderRoutes } from "react-router-config";
import SprintDetailAside from "../components/SprintDetailAside"
const Sprintdetail = (props) => {
    const { route } = props;
    return (
        <Layout className="sprint-detail">
            <SprintDetailAside />
            <Layout className="sprint-detail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    )
}
export default inject('sprintStore')(observer(Sprintdetail));