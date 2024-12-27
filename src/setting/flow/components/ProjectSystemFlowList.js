/*
 * @Descripttion: 流程列表，模板，用于初始化项目
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:15:55
 */
import React from "react";
import {SystemFlow} from 'tiklab-flow-ui';

const ProjectSystemFlowList = (props) => {
    

    const goForm = (id) => {
        props.history.push(`/setting/FormDetail/${id}`)
    }

    return (
        <SystemFlow goForm = {goForm}  isBase = {false}  viewRouter = {"/setting/flowDetailView"} designRouter = {"/setting/flowDetailDesign"}/>
    )
}
export default ProjectSystemFlowList;