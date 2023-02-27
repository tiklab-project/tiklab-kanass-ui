/*
 * @Descripttion: 工时页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 15:36:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:05:52
 */
import React, { Fragment, useEffect, useState } from "react";
import { Tabs } from 'antd';
import { observer, inject } from "mobx-react";
import UserLogStatistics from "./UserLogStatistics";
import "../components/Log.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
const { TabPane } = Tabs;


const LogStatistics = (props) => {
    const { workStore, logStore } = props
    const { findProjectList } = workStore;
    const { findAllWorkLog, perWorkingHours, findMatterWorkingHours } = logStore;

    useEffect(() => {
        findProjectList()
        findAllWorkLog()
        return;
    }, [])

    return (
        <Fragment>
            <Breadcumb
                {...props}
                firstText="人员工时统计"
            />
          
                    <div style={{ padding: "20px 0" }}>
                        {/* <Tabs defaultActiveKey="Work" type="card" >
                            <TabPane tab="成员" key="User">
                                
                            </TabPane>
                        </Tabs> */}
                        <UserLogStatistics findMatterWorkingHours={findMatterWorkingHours} {...props} />
                    </div>
        </Fragment>
    )
}
export default inject('workStore', 'logStore')(observer(LogStatistics));