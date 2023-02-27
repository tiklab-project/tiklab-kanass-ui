import React from "react";
import {NodeStatusList} from 'tiklab-flow-ui';

const ProjectNodeStatusList = (props) => {
    return (
        <NodeStatusList {...props} flowIdTag={"id"} isBase = {false}/>
    )
}
export default ProjectNodeStatusList;