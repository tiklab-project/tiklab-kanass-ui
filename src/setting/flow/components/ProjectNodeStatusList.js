/*
 * @Descripttion: 流程节点，内部初始化使用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:15:55
 */
import React from "react";
import {NodeStatus} from 'tiklab-flow-ui';

const ProjectNodeStatusList = (props) => {
    return (
        <NodeStatus {...props} flowIdTag={"id"} isBase = {false}/>
    )
}
export default ProjectNodeStatusList;