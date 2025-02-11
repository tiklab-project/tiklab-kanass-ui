/*
 * @Descripttion: 工时列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:20:41
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Table, Row, Col, Space } from 'antd';
import LogFilter from "./LogFilter";
import LogAdd from "./LogAdd";
import LogDetail from "./LogDetail";
import Button from "../../../common/button/Button";
import moment from "moment";
import { withRouter } from "react-router";
import "./LogAllList.scss"
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
const LogAllList = (props) => {
    const { logStore } = props;
    const { findWorkLogPage, logList, selectLogCondition } = logStore;
    const [dateValue, setDateValue] = useState()
    const [showLogAdd, setShowLogAdd] = useState(false)
    // 点击的日志的索引，用于详情修改，列表回显
    const [listIndex, setListIndex] = useState()
    // 日志详情弹窗显示参数
    const [logDetailVisable, setLogDetailVisable] = useState(false);
    // 点击显示详情的日志id
    const [logId, setLogId] = useState()
    const projectId = props.match.params.id;
    /**
    * 获取项目列表
    */
    useEffect(() => {
        getList()

        return;
    }, [])

    /**
     * 进入页面获取一周的日志列表
     */
    const getList = () => {
        const data = {
            projectId: projectId,
            startTime: moment().subtract(7, 'days').startOf("day").format("YYYY-MM-DD"),
            endTime: moment().add(1, 'days').format("YYYY-MM-DD"),
        }
        findWorkLogPage(data)
        setDateValue([moment().subtract(7, 'days'), moment()])
    }


    /**
     * 显示日志详情
     * @param {日志id} id 
     * @param {日志索引} index 
     */
    const goLogDetail = (id, index) => {
        setLogId(id);
        setLogDetailVisable(true);
        setListIndex(index)
    }

    const columns = [
        {
            title: "工作内容22",
            dataIndex: "workContent",
            key: "workContent",
            align: "left",
            width: "50%",
            ellipsis: true,
            render: (text, record, index) => <div onClick={() => goLogDetail(record.id, index)} className="worklog-content">
                {text}
            </div>,
        },
        {
            title: "用时",
            dataIndex: "takeupTime",
            key: "endTime",
            align: "left",
            width: "7%"
        },
        {
            title: "事项",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "left",
            width: "15%"
        },
        {
            title: "项目",
            dataIndex: ["project", "projectName"],
            key: "projectName",
            align: "left",
            width: "15%"
        },
        {
            title: "负责人",
            dataIndex: ["user", "nickname"],
            key: "user",
            align: "left",
            width: "10%"
        },
        {
            title: "记录日期",
            dataIndex: "workDate",
            key: "workDate",
            align: "left"
        }

    ];

    /**
     * 翻页
     * @param {页面信息} pagination 
     */
    const changePage = (pagination) => {
        findWorkLogPage({ worker: null, projectId: projectId, pageParam: { current: pagination.current } })
    }

    /**
     * 切换tab
     * @param {tab key } value 
     */
    const changeTabs = value => {
        findWorkLogPage({ worker: null, projectId: projectId })
    }
    return (
        <Row className="log-list">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <Breadcrumb firstText={"全部工时"}>
                    <Button type="primary" onClick={() => setShowLogAdd(true)}>
                        添加工时
                    </Button>
                    <LogAdd 
                        page = "log" 
                        modalType = {"edit"}
                        showLogAdd={showLogAdd} 
                        setShowLogAdd={setShowLogAdd} 
                        changeTabs={changeTabs} 
                        findWorkLogList = {findWorkLogPage}
                    />
                </Breadcrumb>
                <LogFilter dateValue={dateValue} setDateValue={setDateValue} />
                <Table
                    className="log-table"
                    columns={columns}
                    dataSource={logList}
                    rowKey={(record) => record.id}
                    onChange={changePage}
                    pagination={{
                        onChange: changePage,
                        position: ["bottomCenter"],
                        ...selectLogCondition.pageParam
                    }}
                    scroll={{x: "100%"}}
                />

                <LogDetail logId={logId} listIndex={listIndex} logDetailVisable={logDetailVisable} setLogDetailVisable={setLogDetailVisable} />
            </Col>
        </Row>
    )
}
export default withRouter(inject("logStore")(observer(LogAllList)));