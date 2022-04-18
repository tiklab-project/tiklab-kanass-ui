/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState } from "react";
import Sprintsurvey from "../../sprintSurvey/containers/sprintSurvey";
import WorkItem from "../../../project/work/components/workItem";
import { inject, observer } from "mobx-react";
import "../components/sprint.scss"
import { Breadcrumb, Tabs, Divider, Layout, Row, Col } from 'antd';
import SprintPlan from "../../sprintPlan/containers/sprintPlan";
import SprintStatistics from "../../sprintStatistics/containers/statistics"
const { Sider } = Layout;
const { TabPane } = Tabs;
const Sprintdetail = (props) => {
    const sprint = localStorage.getItem("sprintId");
    const { sprintStore } = props;
    const { searchsprintList } = sprintStore;
    useEffect(() => {
        searchsprintList(sprint)
    }, [])


    return (
        <div className="sprint-detail">
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/sprint">迭代列表</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">迭代详情</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="sprint-detail-content">
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="概况" key="1">
                        <Sprintsurvey {...props} />
                    </TabPane>
                    <TabPane tab="事项" key="2">
                        <WorkItem {...props} />
                    </TabPane>
                    <TabPane tab="规划" key="3">
                        <SprintPlan {...props} />
                    </TabPane>
                    <TabPane tab="统计" key="4">
                        <SprintStatistics {...props} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
export default inject('sprintStore')(observer(Sprintdetail));