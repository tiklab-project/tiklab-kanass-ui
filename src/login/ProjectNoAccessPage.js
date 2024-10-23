import React from "react";
import {NoAccess} from "tiklab-privilege-ui";
import { UserVerify } from "tiklab-user-extension-ui";

/**
 * 没有资源访问权限
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
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