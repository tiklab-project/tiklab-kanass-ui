import React from "react";
import {SystemFlow} from 'tiklab-flow-ui';

const ProjectSystemFlowListSystem = (props) => {
    return (
        <SystemFlow isBase = {true} viewRouter = {"/setting/flowDetailView"} designRouter = {"/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowListSystem;