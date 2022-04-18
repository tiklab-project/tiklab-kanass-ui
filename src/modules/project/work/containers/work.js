/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-24 13:20:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 13:27:06
 */
import React from "react";
import { Layout, Row, Col } from "antd";
import WorkAside from "../../../work/components/workFilterAside";
import WorkItem from "../components/workItem"
import { withRouter } from "react-router";
const { Sider } = Layout;

const Work = (props) => {
    return (
        <WorkItem {...props} />
    )
}
export default withRouter(Work);