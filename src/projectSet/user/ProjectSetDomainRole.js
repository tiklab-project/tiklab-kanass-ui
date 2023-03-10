/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-05 17:06:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:20:30
 */
import React from "react";
import { DomainRole } from 'tiklab-user-ui';
import { inject, observer } from "mobx-react";

const ProjectSetDomainRole = props => {
    const projectSetId = props.match.params.projectSetId;
    return (
        <div>
            <DomainRole
                {...props}
                domainId={projectSetId}
                bgroup = {"teamwire"}
            />
        </div>
           
        
    )
}
export default inject("privilegeDomainRoleStore")(observer(ProjectSetDomainRole)) ;