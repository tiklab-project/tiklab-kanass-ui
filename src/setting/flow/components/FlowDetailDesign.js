
import React, { useEffect } from "react";
import {FlowChart} from 'tiklab-flow-ui';
import { observer } from "mobx-react";
import FlowStore from "../store/FlowStore";
import { getUser } from "tiklab-core-ui";

const FlowDetailDesign = (props) => {
    const {userList, findUserList} = FlowStore;
    const userId = getUser().userId;
    useEffect(()=> {
        findUserList()
        return;
    }, [])
    return (
        <FlowChart isBase = {false} userList = {userList} userId = {userId}/>
    )
}
export default observer(FlowDetailDesign);