/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:41:29
 * @Description: 没有资源访问权限
 */

import React from "react";
import {NoAccess} from "tiklab-privilege-ui";
import { UserVerify } from "tiklab-user-extension-ui";

const ProjectNoAccessPage = props =>{
    const project = JSON.parse(localStorage.getItem('project'));
    const projectId = project?.id;
    return (
        <NoAccess
            {...props}
            homePath={projectId ? `/project/${projectId}/set/projectDomainRole` : '/index/overview'} //传返回的页面路由参数
        />
    )
}

export default UserVerify(ProjectNoAccessPage,"/noAuth", "kanass");