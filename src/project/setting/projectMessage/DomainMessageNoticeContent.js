import React from "react";
import {DomainMessageNotice} from "tiklab-message-ui";

/**
 * 项目域消息通知方案
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const DomainMessageNoticeContent = props =>{
    const projectId = props.match.params.id;
    return (
        <DomainMessageNotice
            {...props}
            domainId={projectId}  // 项目id
            bgroup={"kanass"} // 产品code
            isBase = {env === "prod" ? false : true}
        />
    )

}

export default DomainMessageNoticeContent
