/*
 * @Descripttion: 计划列表，此模块已弃用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 16:42:56
 */
import React from "react";
import { Row, Col } from 'antd';
import PlanAddmodal from "./PlanAddModal";
import { observer } from "mobx-react";
import PlanTable from "./PlanTable";
import PlanAside from "./PlanAside";
import "../components/Plan.scss"
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import PlanStore from "../store/PlanStores"
const Plan = (props) => {
    const { getPlanList, planList, addPlan } = PlanStore;
    // 项目id
    const projectId = props.match.params.id;

    /**
     * 搜索计划 ？模糊匹配接口有问题
     */
    const onSearch = (value) => {
        getPlanList({ planName: value })
    }

    return (
        <Row >
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-plan">
                    <PlanAside />
                    <div className="project-plan-list">
                        <Breadcumb
                            firstText="项目管理"
                            secondText="计划管理"
                        />
                        <div style={{ padding: "20px 0" }}>
                            <div className="plan-search">
                                <InputSearch
                                    placeholder="搜索版本"
                                    allowClear
                                    style={{ width: 300 }}
                                    onChange={onSearch}
                                />
                                <PlanAddmodal
                                    name="添加计划"
                                    type="add"
                                    planList={planList}
                                    addPlan={addPlan}
                                    projectId={projectId}
                                ></PlanAddmodal>
                            </div>
                            <div className="plan-table">
                                <PlanTable />
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>

    )
}
export default observer(Plan);