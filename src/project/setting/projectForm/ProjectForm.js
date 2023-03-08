
/*
 * @Descripttion: 项目的表单列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React from "react";
import {ProjectForm} from 'tiklab-form-ui';

const ProjectFormList = (props) => {
    const projectId = props.match.params.id;
    return (
        <ProjectForm domainId = {projectId}/>
    )
}
export default ProjectFormList;