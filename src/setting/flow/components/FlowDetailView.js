/*
 * @Descripttion: 流程详情查看页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:15:55
 */
import React from "react";
import {FlowChartLink} from 'tiklab-flow-ui';

const FlowDetailView = (props) => {
    const flowId = props.match.params.flowId;
    return (
        <FlowChartLink flowId= {flowId} {...props} flowIdTag={"id"} />
    )
}
export default FlowDetailView;