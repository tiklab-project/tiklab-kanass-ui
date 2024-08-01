/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState, useRef } from "react";
import { Provider, inject, observer } from "mobx-react";
import { Layout } from "antd";
import "../components/VersionLayout.scss";
import { renderRoutes } from "react-router-config";
import VersionDetailAside from "./VersionDetailAside";
import VersionDetailStore from "../store/VersionDetailStore";
import WorkStore from "../../../work/store/WorkStore";
import HeaderCe from "../../../home/common/components/HeaderCe";

const Versiondetail = (props) => {
    const store = {
        versionDetailStore: VersionDetailStore
    }
    const { setSearchConditionNull, setTabValue } = WorkStore;
    useEffect(() => {
        setSearchConditionNull()
        setTabValue({id: "all", type: "system"})
        return () => {
            setSearchConditionNull()
            setTabValue({id: "all", type: "system"})
        }
    }, []);
    
    const { route } = props;
    return (<Provider {...store}>
        <Layout className="version-detail">
            <VersionDetailAside />
            <Layout className="version-detail-content">
                <HeaderCe />
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>
        
    )
}
export default observer(Versiondetail);