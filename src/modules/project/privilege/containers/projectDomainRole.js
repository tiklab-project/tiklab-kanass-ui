/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-05 17:06:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:20:30
 */
import React from "react";
import { PrivilegeDomainRole } from 'doublekit-privilege-ui';

const ProjectDomainRole = props => {
    const projectId = localStorage.getItem("projectId");
    
    return (
        <div className="test">
            <PrivilegeDomainRole
                {...props}
                domainId={projectId}
            />
        </div>
    )
}

export default ProjectDomainRole;