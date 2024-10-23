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
import "../components/StageLayout.scss";
import { renderRoutes } from "react-router-config";
import StageDetailAside from "./StageDetailAside";
import StageDetailStore from "../store/StageDetailStore";
import WorkStore from "../../../work/store/WorkStore";
import { getUser } from "tiklab-core-ui";
import { UserVerify } from "tiklab-user-extension-ui";

const Stagedetail = (props) => {
    const { route, systemRoleStore } = props;
    const store = {
        stageDetailStore: StageDetailStore
    }
    const { setSearchConditionNull, setTabValue } = WorkStore;
    const userId = getUser().userId;
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));

    useEffect(() => {
        setSearchConditionNull()
        setTabValue({id: "all", type: "system"})
        const isPublish = project?.projectLimits === "0" ? true : false;
        systemRoleStore.getInitProjectPermissions(userId, projectId, isPublish)
        return () => {
            setSearchConditionNull()
            setTabValue({id: "all", type: "system"})
        }
    }, []);
    

    
    return (<Provider {...store}>
        <Layout className="stage-detail">
            <StageDetailAside />
            <Layout className="stage-detail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>
        
    )
}
export default inject("systemRoleStore")(observer(UserVerify(Stagedetail,"/noAuth", "kanass")));