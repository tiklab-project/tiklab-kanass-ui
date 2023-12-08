import React from "react";
import {MessageNotice} from 'thoughtware-message-ui';

const ProjectMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'kanass'} isBase={false}/>
    )
}
export default ProjectMessageNotice;