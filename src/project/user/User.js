/*
 * @Descripttion: 项目成员
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React from "react";
import { DomainUser } from 'thoughtware-user-ui';

const User = props => {
    // 项目id
    const projectId = props.match.params.id;
    return (
        <div className="project-user" style={{ paddingRight: "8px" }}>
            <DomainUser
                {...props}
                domainId={projectId}
                bgroup={"kanass"}
                domainType = "project"
            />
        </div>
    )
}

export default User;
