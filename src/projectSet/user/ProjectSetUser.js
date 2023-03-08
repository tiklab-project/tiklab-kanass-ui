/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React from "react";
import { DomainUser } from 'tiklab-user-ui';
import { inject, observer } from "mobx-react";

const ProjectSetUser = props => {
    const projectSetId = props.match.params.projectSetId;
    return (
        <div className="project-user">
            <DomainUser
                {...props}
                domainId={projectSetId}
                bgroup = {"teamwire"}
            />
        </div>
    )
}

export default inject("domainUserStore")(observer(ProjectSetUser));
