/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:24:06
 * @Description: 流程设计页面
 */

import React, {useEffect} from "react";
import {FlowChart} from 'tiklab-flow-ui';
import { observer } from "mobx-react";
import ProjectFlowStore from "../store/ProjectFlowStore"
import { getUser } from "tiklab-core-ui";

const ProjectFlowDetailDesign = (props) => {
    const {getUserList, userList} = ProjectFlowStore;
    const projectId = props.match.params.id;
    const userId = getUser().userId

    useEffect(() => {

        getUserList({projectId: projectId})
        return
    },[])
    return (
        <FlowChart domainId={projectId} isBase = {false} userList = {userList} userId = {userId}/>
    )
}

export default observer(ProjectFlowDetailDesign);