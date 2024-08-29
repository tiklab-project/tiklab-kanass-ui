import React from "react";
import {SystemFlow} from 'thoughtware-flow-ui';

const ProjectSystemFlowListSystem = (props) => {

    const goForm = (id) => {
        props.history.push(`/setting/FormDetailSys/${id}`)
    }

    return (
        <SystemFlow goForm = {goForm} isBase = {true} viewRouter = {"/setting/flowDetailView"} designRouter = {"/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowListSystem;