
import React, { useEffect } from "react";
import {FlowChart} from 'tiklab-flow-ui';
import { observer } from "mobx-react";
import FlowStore from "../store/FlowStore"
const FlowDetailDesign = (props) => {
    const {userList, findUserList} = FlowStore;
    useEffect(()=> {
        findUserList()
    }, [])
    return (
        <FlowChart isBase = {false} userList = {userList}/>
    )
}
export default observer(FlowDetailDesign);