import React from "react";
import {ProjectMessageNotice} from "tiklab-message-ui";

/**
 * 消息通知方案
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectMessageNoticeContent = props =>{

    return (
        <ProjectMessageNotice
            {...props}
            isBase={true}
            bgroup={"kanass"} // 产品code
        />
    )

}

export default ProjectMessageNoticeContent
