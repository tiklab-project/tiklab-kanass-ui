/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React from "react";
import { DomainUserList } from 'doublekit-user-ui';

const User = props => {
    const projectId = localStorage.getItem("projectId");;
    return (
        <div className="test">
            <DomainUserList
                {...props}
                domainId={projectId}
            />
        </div>
    )
}

export default User;
