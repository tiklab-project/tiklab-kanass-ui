/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 10:49:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-18 17:32:06
 */
import React, { useState } from "react";
import WorkDetail from "./WorkDetail";
import WorkAside from "./WorkAside";
import { observer, inject } from "mobx-react";
import "./WorkList.scss";
import { Form, Row, Col } from "antd";
const Worklist = (props) => {

    const { workStore, route, form } = props;

    const { workList, total, searchCondition } = workStore;

    const [filterModal, setFiltetModal] = useState(false);

    return (
        <div className="work-list">
            <WorkAside
                {...props}
                workList={workList}
                total={total}
                filterModal={filterModal}
                setFiltetModal={setFiltetModal}
                current={searchCondition.pageParam.currentPage}
                form={form}
            ></WorkAside>
            <Row style={{flex: 1}}>
                <Col lg={{ span: 24 }}  xl={{ span: "24" }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                    <div className="work-list-detail">
                        <WorkDetail {...props}></WorkDetail>
                    </div>
                </Col>
            </Row>

        </div>
    )
};

export default inject("workStore")(observer(Worklist));
