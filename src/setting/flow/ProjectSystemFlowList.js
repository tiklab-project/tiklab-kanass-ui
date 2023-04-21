import React from "react";
import {SystemFlow} from 'tiklab-flow-ui';

const ProjectSystemFlowList = (props) => {
    return (
        <SystemFlow isBase = {false}  viewRouter = {"/index/setting/flowDetailView"} designRouter = {"/index/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowList;