import React, { useEffect, useState, useRef, Fragment } from "react";
import { FlowChartLink } from "tiklab-flow-ui";

const WorkFlow = (props) => {
    const {flowId} = props;
    return (
        <div>
            <FlowChartLink flowId = {flowId}/>
        </div>
    )
}

export default WorkFlow;