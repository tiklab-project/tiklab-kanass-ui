/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:26:21
 * @Description: 系统权限角色，开发使用
 */
import React from "react";
import { SystemRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const SystemRoleBuilt = props => {


    return (
        <SystemRole
            bgroup={'kanass'}
            isBase = {true}
            {...props}
        />
    )
}

export default inject("privilegeSystemStore")(observer(SystemRoleBuilt));