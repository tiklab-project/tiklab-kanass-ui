/*
 * @Descripttion: 项目的表单详情
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import { Col, Row } from "antd";
import React from "react";
import { FormDesign as FormDesignList } from 'thoughtware-form-ui';

const ProjectFormDetail = (props) => {

    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <FormDesignList {...props} formIdTag="" />
            </Col>
        </Row>

    )
}
export default ProjectFormDetail;