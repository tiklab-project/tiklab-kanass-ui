/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:19:12
 * @Description: 系统消息通知方案，开发人员使用
 */

import React from "react";
import {MessageNotice} from 'tiklab-message-ui';

const SystemMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'kanass'} isBase={true}/>
    )
}
export default SystemMessageNotice;