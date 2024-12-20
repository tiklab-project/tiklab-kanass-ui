/* 
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:26:29
 * @Description: 项目域消息通知方案
 */

import React from "react";
import {DomainMessageNotice} from "tiklab-message-ui";

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
