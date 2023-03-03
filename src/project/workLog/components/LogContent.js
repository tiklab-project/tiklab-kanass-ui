/*
 * @Descripttion: 日志统计页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Table, Tabs, Row, Col, Space } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./LogContent.scss"
import { getUser } from "tiklab-core-ui";
import LogFilter from "./LogFilter";
import { useState } from "react";
import Button from "../../../common/button/Button";
import LogAdd from "./LogAdd";
import LogDetail from "./LogDetail";

const LogContent = (props) => {
    const { logStore } = props;
    const { findWorkLogPage, logList, selectLogCondition } = logStore;
    // 显示日志添加弹窗显示
    const [showLogAdd, setShowLogAdd] = useState(false)
    // 选中的tab key
    const [activeTab, setActiveTab] = useState("allLog")
    // 登录者id
    const userId = getUser().userId;
    // 点击的日志的索引，用于详情修改，列表回显
    const [listIndex, setListIndex]= useState()
    // 日志详情弹窗显示参数
    const [logDetailVisable, setLogDetailVisable] = useState(false);
    // 点击显示详情的日志id
    const [logId, setLogId] = useState()

    /**
     * 显示日志详情
     * @param {日志id} id 
     * @param {日志索引} index 
     */
    const goLogDetail = (id, index) => {
        console.log(id)
        setLogId(id);
        setLogDetailVisable(true);
        setListIndex(index)
    }

    const columns = [
        {
            title: "事项",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "left",
            render: (text, record, index) => <Space onClick={() => goLogDetail(record.id, index)} className="span-botton">
                {text}
            </Space>,
        },
        {
            title: "项目",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "left",

        },
        {
            title: "负责人",
            dataIndex: ["worker", "name"],
            key: "worker",
            align: "left",
        },
        {
            title: "记录日期",
            dataIndex: "workDate",
            key: "workDate",
            align: "left",
        },
        {
            title: "用时",
            dataIndex: "takeupTime",
            key: "endTime",
            align: "left",
        },
        {
            title: "工作内容",
            dataIndex: "workContent",
            key: "workContent",
            align: "left",
        }
    ];

    /**
     * 翻页
     * @param {页面信息} pagination 
     */
    const changePage = (pagination) => {
        if (activeTab === "allLog") {
            findWorkLogPage({ worker: null, projectId: null, pageParam: { current: pagination.current } })
        }
        if (activeTab === "myLog") {
            findWorkLogPage({ worker: userId, pageParam: { current: pagination.current } })
        }
    }

    /**
     * 切换tab
     * @param {tab key } value 
     */
    const changeTabs = value => {
        setActiveTab(value)
        if (value === "allLog") {
            findWorkLogPage({ worker: null, projectId: null })
        }
        if (value === "myLog") {
            findWorkLogPage({ worker: userId })
        }
    }

    return (
        <Row style={{ height: "100%" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div style={{ padding: "20px" }}>
                    <Breadcumb
                        {...props}
                        firstText="工时查询"
                    >
                        <Button type="primary" onClick={() => setShowLogAdd(true)}>
                            添加日志
                        </Button>
                        <LogAdd showLogAdd={showLogAdd} setShowLogAdd={setShowLogAdd} />
                    </Breadcumb>
                    <div className="log-tab-filter">
                        <div className="log-tabs">
                            <div
                                className={`log-tab ${activeTab === "allLog" ? "active-tabs" : ""}`}
                                key={"allLog"}
                                onClick={() => changeTabs("allLog")}
                            >
                                所有工时
                            </div>
                            <div
                                className={`log-tab ${activeTab === "myLog" ? "active-tabs" : ""}`}
                                key={"myLog"}
                                onClick={() => changeTabs("myLog")}
                            >
                                我的工时
                            </div>

                        </div>
                        <LogFilter type={activeTab} />
                    </div>
                    <Table
                        className="log-list"
                        columns={columns}
                        dataSource={logList}
                        rowKey={(record) => record.id}
                        onChange={changePage}
                        pagination={selectLogCondition.pageParam}
                    />

                    <LogDetail logId = {logId} listIndex = {listIndex} logStore = {logStore} logDetailVisable = {logDetailVisable} setLogDetailVisable = {setLogDetailVisable}/>
                </div>
            </Col>
        </Row>
    )
}
export default inject('logStore')(observer(LogContent));