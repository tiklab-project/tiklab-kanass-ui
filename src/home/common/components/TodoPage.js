/*
 * @Descripttion: 待办事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { Empty, Select, Row, Col, Pagination } from "antd";
import { inject, observer } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import "./TodoPage.scss"
import { withRouter } from "react-router";
import TodoListPage  from "./TodoPageList"
const TodoListPafe = (props) => {
    const { homeStore } = props;

    return (
        <Row className="todo-page">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <TodoListPage {...props}></TodoListPage>
            </Col>
        </Row>

    )
}
export default withRouter(inject('homeStore')(observer(TodoListPafe)));