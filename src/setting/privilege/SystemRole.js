/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:26:21
 * @Description: 系统权限角色
 */
import React from "react";
import { SystemRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";
const SystemRoleWrap = props => {


    return (
            <SystemRole
                {...props}
                isBase = {true}
                bgroup={'kanass'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));