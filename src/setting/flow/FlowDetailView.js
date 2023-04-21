import React from "react";
import {FlowChartLink} from 'tiklab-flow-ui';

const FlowDetailView = (props) => {
    return (
        <FlowChartLink {...props} flowIdTag={"id"} />
    )
}
export default FlowDetailView;