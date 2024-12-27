
/*
 * @Descripttion: 项目的流程列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:22:31
 */
import React, { useState, useEffect } from "react";
import { ProjectFlow } from 'tiklab-flow-ui';
import { withRouter } from "react-router";
import ProjectFlowStore from "../store/ProjectFlowStore"
import { observer } from "mobx-react";

const ProjectProjectFlowList = (props) => {
    const { getUserList, userList } = ProjectFlowStore;
    const projectId = props.match.params.id;
    const [router, setRouter] = useState();

    useEffect(() => {
        setRouter(`/project/${projectId}/set/projectFlowDetail`);

        getUserList({ projectId: projectId })
        return null;
    }, [])

    const goForm = (id) => {
        props.history.push(`/project/${projectId}/set/ProjectFormDetail/${id}`)
    }

    return (
        <ProjectFlow goForm = {goForm} domainId={projectId} viewRouter={router} designRouter={router} {...props} />

    )
}
export default withRouter(observer(ProjectProjectFlowList));