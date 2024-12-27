/*
 * @Descripttion: 待办事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:54:43
 */

import React from "react";
import { Row, Col} from "antd";
import { observer } from "mobx-react";
import "./TodoPage.scss"
import { withRouter } from "react-router";
import TodoPageList from "./TodoPageList"

const TodoListPage = (props) => {
    return (
        <Row className="todo-page">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>

                <TodoPageList {...props}></TodoPageList>
            </Col>
        </Row>

    )
}
export default withRouter(observer(TodoListPage));