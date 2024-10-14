import React from "react";
import {FlowChartLink} from 'tiklab-flow-ui';

const FlowDetailView = (props) => {
    const flowId = props.match.params.flowId;
    return (
        <FlowChartLink flowId= {flowId} {...props} flowIdTag={"id"} />
    )
}
export default FlowDetailView;