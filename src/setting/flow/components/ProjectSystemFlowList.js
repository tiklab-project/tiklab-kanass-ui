import React from "react";
import {SystemFlow} from 'thoughtware-flow-ui';

const ProjectSystemFlowList = (props) => {
    return (
        <SystemFlow isBase = {false}  viewRouter = {"/setting/flowDetailView"} designRouter = {"/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowList;