/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 15:27:15
 */
import React from "react";
import { Breadcrumb, Input, Layout, Row, Col, Divider } from 'antd';
import PlanAddmodal from "../components/planAdd";
import { observer, inject } from "mobx-react";
import PlanTable from "../components/planTable"
import "../components/plan.scss"

const { Search } = Input;
const Plan = (props) => {
    const { planStore } = props
    const { getPlanList, planList, addPlan } = planStore
    const projectId = localStorage.getItem("projectId");

    /**
     * 搜索计划 ？模糊匹配接口有问题
     */
    const onSearch = (value) => {
        getPlanList({ planName: value })
    }

    return (
        <div className="project-plan">
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">计划管理</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="search-add">
                <Search
                    placeholder="输入名称"
                    allowClear
                    style={{ width: 300 }}
                    onSearch={onSearch}
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
    )
}
export default inject("planStore")(observer(Plan));