import React from "react";
import {SystemFlow} from 'thoughtware-flow-ui';

const ProjectSystemFlowList = (props) => {
    

    const goForm = (id) => {
        props.history.push(`/setting/FormDetail/${id}`)
    }

    return (
        <SystemFlow goForm = {goForm}  isBase = {false}  viewRouter = {"/setting/flowDetailView"} designRouter = {"/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowList;