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
const { TabPane } = Tabs;

const LogContent = (props) => {
    const { logStore } = props;
    const { findWorkLogPage, logList, selectLogCondition } = logStore;

    const [showLogAdd, setShowLogAdd] = useState(false)
    const [activeTab, setActiveTab] = useState("allLog")
    const type = props.match.params.type;
    const userId = getUser().userId;
    const projectId = props.match.params.id;
    const [listIndex, setListIndex]= useState()
    const [logDetailVisable, setLogDetailVisable] = useState(false);
    const [logId, setLogId] = useState()

    useEffect(() => {
        // getList()
    }, [type])

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
    const changePage = (pagination) => {
        if (type === "allLog") {
            findWorkLogPage({ worker: null, projectId: null, pageParam: { current: pagination.current } })
        }
        if (type === "myLog") {
            findWorkLogPage({ worker: userId, pageParam: { current: pagination.current } })
        }
    }
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