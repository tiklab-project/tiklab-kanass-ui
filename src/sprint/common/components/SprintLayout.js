/*
 * @Descripttion: 迭代详情页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState, useRef } from "react";
import { Provider, inject, observer } from "mobx-react";
import { Empty, Layout } from "antd";
import "../components/SprintLayout.scss";
import { renderRoutes } from "react-router-config";
import SprintDetailAside from "./SprintDetailAside";
import SprintDetailStore from "../store/SprintDetailStore";
import WorkStore from "../../../work/store/WorkStore";
import { getUser } from "tiklab-core-ui";
import { UserVerify } from "tiklab-user-extension-ui";
import ProjectEmpty from "../../../common/component/ProjectEmpty";

const Sprintdetail = (props) => {
    const { route, systemRoleStore } = props;
    const store = {
        sprintDetailStore: SprintDetailStore
    }
    const { findSprint, sprint } = SprintDetailStore;
    const { setSearchConditionNull, setTabValue } = WorkStore;
    const userId = getUser().userId;
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const sprintId = props.match.params.sprint;

    useEffect(() => {
        setSearchConditionNull()
        findSprint({ sprintId: sprintId }).then(res => {
            console.log(res)
        })
        setTabValue({ id: "all", type: "system" })
        const isPublish = project?.projectLimits === "0" ? true : false;
        systemRoleStore.getInitProjectPermissions(userId, projectId, isPublish)
        return () => {
            setSearchConditionNull()
            setTabValue({ id: "all", type: "system" })
        }
    }, []);



    return (<Provider {...store}>
        <Layout className="sprint-detail">
            <SprintDetailAside />
            {
                sprint ? <Layout className="sprint-detail-content">
                    {renderRoutes(route.routes)}
                </Layout>
                    :
                    <div className="sprint-detail-empty">
                        <ProjectEmpty description="迭代不存在或者已被删除"></ProjectEmpty>
                    </div>

            }

        </Layout>

    </Provider>

    )
}
export default inject("systemRoleStore")(UserVerify(observer(Sprintdetail), "/noAuth", "kanass"));