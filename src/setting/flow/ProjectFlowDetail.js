import React from "react";
import {FlowChartLink} from 'tiklab-flow-ui';

const ProjectFlowDetail = (props) => {
    return (
        <FlowChartLink {...props} flowIdTag={"id"} />
    )
}
export default ProjectFlowDetail;