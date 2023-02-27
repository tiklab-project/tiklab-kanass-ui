
import React, { useState }  from "react";
import { Modal } from "antd";
import { ProjectFlowList } from 'tiklab-flow-ui';
import { withRouter } from "react-router";

const ProjectProjectFlowList = (props) => {
    const projectId = props.match.params.id;
    return (
        <ProjectFlowList domainId={projectId} />

    )
}
export default withRouter(ProjectProjectFlowList);