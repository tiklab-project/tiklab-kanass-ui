
/*
 * @Descripttion: 项目的表单列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ProjectForm } from 'thoughtware-form-ui';

const ProjectFormList = (props) => {
    const projectId = props.match.params.id;
    const [router, setRouter] = useState()
    useEffect(() => {
        setRouter(`/project/${projectId}/set/ProjectFormDetail`)
        return
    }, [])

    return (
        <ProjectForm domainId={projectId} router={router} formIdTag="" />
    )
}
export default ProjectFormList;