
/*
 * @Descripttion: 项目的流程列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import React, { useState, useEffect }  from "react";
import { ProjectFlow } from 'tiklab-flow-ui';
import { withRouter } from "react-router";

const ProjectProjectFlowList = (props) => {
    const projectId = props.match.params.id;
    const path = props.match.path.split("/")[2];
    const [router, setRouter] = useState();
    useEffect(() => {
        setRouter(`/index/${path}/${projectId}/projectSetDetail/projectFlowDetail`)
        return
    },[])
    return (
        <ProjectFlow domainId={projectId} viewRouter = {router} designRouter = {router} {...props}/>

    )
}
export default withRouter(ProjectProjectFlowList);