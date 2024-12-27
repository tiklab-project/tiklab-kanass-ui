/*
 * @Descripttion: 项目角色
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-05 17:06:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 16:51:59
 */
import React from "react";
import { DomainRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

const ProjectDomainRole = props => {
    const projectId = props.match.params.id;

    return (
        <DomainRole
            {...props}
            domainId={projectId}
            bgroup = {"kanass"}
        />
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectDomainRole));