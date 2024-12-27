/*
 * @Descripttion: 工时列表页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:01:33
 */
import React, { useEffect } from "react";
import { observer, Provider } from "mobx-react";
import { Table, Row, Col, Space } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./LogContent.scss"
import { getUser } from "tiklab-core-ui";
import LogFilter from "./LogFilter";
import { useState } from "react";
import Button from "../../../common/button/Button";
import LogAdd from "./LogAdd";
import LogDetail from "./LogDetail";
import moment from "moment";
import LogStore from "../store/LogStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
const LogContent = (props) => {
    const store = {
        logStore: LogStore
    }
    const { findWorkLogPage, logList, selectLogCondition, totalLog, deleteWorkLog } = LogStore;
    const [dateValue, setDateValue] = useState()
    // 显示日志添加弹窗显示
    const [showLogAdd, setShowLogAdd] = useState(false)
    // 选中的tab key
    const [activeTab, setActiveTab] = useState("allLog")
    // 登录者id
    const userId = getUser().userId;
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
        if (activeTab === "allLog") {
            const data = {
                projectId: projectId,
                // startTime: moment().subtract(7, 'days').startOf("day").format("YYYY-MM-DD"),
                startTime: "2023-12-01",
                endTime: moment().add(1, 'days').format("YYYY-MM-DD"),
            }
            findWorkLogPage(data)
        }
        if (activeTab === "myLog") {
            const data = {
                worker: userId,
                projectId: projectId,
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
            }
            findWorkLogPage(data)
        }
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
            title: "工作内容",
            dataIndex: "workContent",
            key: "workContent",
            align: "left",
            width: "30%",
            ellipsis: true,
            render: (text, record, index) => <div onClick={() => goLogDetail(record.id, index)} className="worklog-content">
                {text}
            </div>,
        },
        {
            title: "用时",
            dataIndex: "takeupTime",
            key: "takeupTime",
            align: "left",
            width: "7%"
        },
        {
            title: "事项",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "left",
            width: "30%",
            render: (text, record, index) => <Space onClick={() => goLogDetail(record.id, index)} className="work-name">
                <ImgComponent
                    src={record.workItem.workTypeSys?.iconUrl}
                    alt=""
                    className="icon-15"
                />
                <div className="work-name-text">{text}</div>
            </Space>,
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
            width: "10%",
            render: (text, record, index) => <Space>
                <UserIcon userInfo={record.workItem.assigner} name={record.workItem.assigner?.nickname} />
                {text}
            </Space>,
        },
        {
            title: "记录日期",
            dataIndex: "workDate",
            key: "workDate",
            align: "left",
            width: "10%",
            render: (text, record, index) => <div>
                {text?.slice(0, 10)}
            </div>,
        },

        // {
        //     title: "操作",
        //     dataIndex: "action",
        //     key: "action",
        //     align: "left",
        //     width: "7%",
        //     render: (text, record, index) => (
        //         <Space size="middle">
        //             <DeleteModal deleteFunction={deleteLogList} id={record.id} />
        //         </Space>

        //     ),
        // }
    ];

    const deleteLogList = (id) => {
        deleteWorkLog({ id: id }).then(res => {
            if (res.code === 0) {
                getList()
            }

        })
    }

    /**
     * 翻页
     * @param {页面信息} pagination 
     */
    const changePage = (pagination) => {
        if (activeTab === "allLog") {
            findWorkLogPage({ worker: null, projectId: projectId, pageParam: { currentPage: pagination.current, pageSize: pagination.pageSize } })
        }
        if (activeTab === "myLog") {
            findWorkLogPage({ worker: userId, projectId: projectId, pageParam: { currentPage: pagination.current, pageSize: pagination.pageSize } })
        }
        console.log(pagination)
    }

    /**
     * 切换tab
     * @param {tab key } value 
     */
    const changeTabs = value => {
        setActiveTab(value)
        const params = {
            projectId: projectId,
            pageParam: {
                currentPage: 1,
                pageSize: 30
            }
        }
        if (value === "allLog") {
            findWorkLogPage({ worker: null, ...params })
        }
        if (value === "myLog") {
            findWorkLogPage({ worker: userId, ...params })
        }
    }

    return (<Provider {...store}>
        <Row style={{ height: "100%", background: "#fff", overflow: "auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "20", offset: "2" }}>
                <div style={{ padding: "20px" }} className="workItem-log">
                    <Breadcumb
                        {...props}
                        firstText="工时"
                    >
                        <Button type="primary" onClick={() => setShowLogAdd(true)}>
                            添加工时
                        </Button>
                        <LogAdd
                            page="projectLog"
                            showLogAdd={showLogAdd}
                            setShowLogAdd={setShowLogAdd}
                            findWorkLogList={changeTabs}
                            modalType={"add"}
                            activeTab={activeTab}
                        />
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
                        <LogFilter type={activeTab} dateValue={dateValue} setDateValue={setDateValue} />
                    </div>
                    <Table
                        className="log-table"
                        columns={columns}
                        dataSource={logList}
                        rowKey={(record) => record.id}
                        onChange={changePage}
                        scroll={{
                            x: "100%"
                        }}
                        pagination={{
                            // onChange: changePage,
                            total: totalLog,
                            position: ["bottomCenter"],
                            current: selectLogCondition.pageParam.currentPage,
                            ...selectLogCondition.pageParam
                        }}
                    />

                    <LogDetail
                        logId={logId}
                        listIndex={listIndex}
                        logDetailVisable={logDetailVisable}
                        setLogDetailVisable={setLogDetailVisable}
                        getList={getList}
                    />
                </div>
            </Col>
        </Row>
    </Provider>

    )
}
export default observer(LogContent);