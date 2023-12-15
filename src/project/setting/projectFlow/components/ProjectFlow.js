
/*
 * @Descripttion: 项目的流程列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import React, { useState, useEffect } from "react";
import { ProjectFlow } from 'thoughtware-flow-ui';
import { withRouter } from "react-router";
import ProjectFlowStore from "../store/ProjectFlowStore"
import { observer } from "mobx-react";
import { Col, Row } from "antd";

const ProjectProjectFlowList = (props) => {
    const { getUserList, userList } = ProjectFlowStore;
    const projectId = props.match.params.id;
    const [router, setRouter] = useState();

    useEffect(() => {
        setRouter(`/projectDetail/${projectId}/projectSetDetail/projectFlowDetail`);

        getUserList({ projectId: "projectId" })
        return
    }, [])
    return (
                <ProjectFlow domainId={projectId} viewRouter={router} designRouter={router} {...props} />


    )
}
export default withRouter(observer(ProjectProjectFlowList));