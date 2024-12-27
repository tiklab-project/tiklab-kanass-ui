/*
 * @Descripttion: 流程设置界面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-28 16:34:32
 */
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