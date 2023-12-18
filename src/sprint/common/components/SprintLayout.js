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
import "../components/SprintLayout.scss";
import { renderRoutes } from "react-router-config";
import SprintDetailAside from "./SprintDetailAside";
import SprintDetailStore from "../store/SprintDetailStore";
import WorkStore from "../../../work/store/WorkStore";

const Sprintdetail = (props) => {
    const { route } = props;
    const store = {
        sprintDetailStore: SprintDetailStore
    }
    const { setSearchConditionNull, setSearchType } = WorkStore;
    useEffect(() => {
        setSearchConditionNull()
        setSearchType("all")
        return () => {
            setSearchConditionNull()
            setSearchType("all")
        }
    }, []);
    

    
    return (<Provider {...store}>
        <Layout className="sprint-detail">
            <SprintDetailAside />
            <Layout className="sprint-detail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>
        
    )
}
export default observer(Sprintdetail);