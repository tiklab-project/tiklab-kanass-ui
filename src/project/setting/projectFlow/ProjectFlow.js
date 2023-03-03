
/*
 * @Descripttion: 项目的流程列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import React, { useState }  from "react";
import { ProjectFlowList } from 'tiklab-flow-ui';
import { withRouter } from "react-router";

const ProjectProjectFlowList = (props) => {
    const projectId = props.match.params.id;
    return (
        <ProjectFlowList domainId={projectId} />

    )
}
export default withRouter(ProjectProjectFlowList);