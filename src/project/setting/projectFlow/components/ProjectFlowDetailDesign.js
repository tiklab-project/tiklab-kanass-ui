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
        <FlowChart isBase = {false} userList = {userList} userId = {userId}/>
    )
}

export default observer(ProjectFlowDetailDesign);