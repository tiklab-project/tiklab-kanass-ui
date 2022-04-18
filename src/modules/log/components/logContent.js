/*
 * @Descripttion: 日志页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 15:36:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:05:52
 */
import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Row, Col, Divider, Tabs } from 'antd';
import { observer, inject } from "mobx-react";
import WorkLog from "./workLogTable";
import UserLog from "./userLogTable";
import "../components/log.scss";
const { TabPane } = Tabs;


const LogContent = (props) => {
    const { workStore, logStore } = props
    const { getProlist } = workStore;
    const { findAllWorkLog, perWorkingHours, findMatterWorkingHours } = logStore;

    useEffect(() => {
        getProlist()
        findAllWorkLog()
    }, [])

    return (
        <Fragment>
            <div className="top-botton">
                <Breadcrumb>
                    <Breadcrumb.Item>日志管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/">工时列表</a>
                    </Breadcrumb.Item>
                </Breadcrumb>

            </div>
            <Divider />

            <Tabs defaultActiveKey="Work" type="card">
                <TabPane tab="人员" key="User">
                    <UserLog perWorkingHours={perWorkingHours} />
                </TabPane>
                <TabPane tab="事项" key="Work">
                    <WorkLog findMatterWorkingHours={findMatterWorkingHours} />
                </TabPane>
            </Tabs>
        </Fragment>
    )
}
export default inject('workStore', 'logStore')(observer(LogContent));