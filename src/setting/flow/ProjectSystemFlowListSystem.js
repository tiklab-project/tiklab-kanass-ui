import React from "react";
import {SystemFlow} from 'tiklab-flow-ui';

const ProjectSystemFlowListSystem = (props) => {
    return (
        <SystemFlow isBase = {true} viewRouter = {"/index/setting/flowDetailView"} designRouter = {"/index/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowListSystem;