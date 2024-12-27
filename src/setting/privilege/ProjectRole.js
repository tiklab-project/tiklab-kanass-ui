/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:26:06
 * @Description: 项目权限角色
 */

import React from "react";
import { ProjectRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

const ProjectRoleList = props => {
    

    return (
        // <div className="test">
            < ProjectRole
                bgroup={'kanass'}
                isBase = {true}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectRoleList));