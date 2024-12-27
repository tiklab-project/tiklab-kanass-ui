/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:16:47
 * @Description: 项目消息通知方案
 */

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
