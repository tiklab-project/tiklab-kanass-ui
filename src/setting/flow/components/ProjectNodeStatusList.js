import React from "react";
import {NodeStatus} from 'tiklab-flow-ui';

const ProjectNodeStatusList = (props) => {
    return (
        <NodeStatus {...props} flowIdTag={"id"} isBase = {false}/>
    )
}
export default ProjectNodeStatusList;