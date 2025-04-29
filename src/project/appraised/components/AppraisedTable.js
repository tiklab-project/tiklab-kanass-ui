import React, {useEffect, useState} from 'react';
import AppraisedStore from "../store/AppraisedStores";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import {Col, Space, Table, Row, Tooltip} from "antd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import AppraisedAddModal from "./AppraisedAdd";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import "./AppraisedTable.scss"
import UserIcon from "../../../common/UserIcon/UserIcon";
import {EditOutlined} from "@ant-design/icons";

const AppraisedTable = (props) => {
    const store = {appraisedStore : AppraisedStore}
    const project = JSON.parse(localStorage.getItem("project"));
    const { appraisedList, setAppraisedList, getAppraisedList, deleteAppraised, createRecent,
        userList, getUserList, searchCondition,
        total, findAllVersionState, status } = AppraisedStore;
    // 项目id
    const projectId = props.match.params.id;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("all");

    /**
     * tab 数组
     */
    const appraisedTab = [
        {
            title: '全部',
            key: 'all',
            icon: "all"
        },
        {
            title: '进行中',
            key: 'progress',
            icon: "programconcern"
        },
        {
            title: '未开始',
            key: 'todo',
            icon: "programconcern"
        },
        {
            title: '已结束',
            key: 'done',
            icon: "programconcern"
        }
    ]

    /**
     * tab 切换
     * @param {tab key} key
     */
    const selectTabs = (key, page) => {
        setActiveTabs(key)
        const params = {
            projectId: projectId,
            pageParam: {
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: page,
            }
        }
        console.log(key);
        switch (key) {
            case "all":
                getAppraisedList({ appraisedState : null, ...params });
                break;
            case "progress":
                getAppraisedList({ appraisedState : "1", ...params });
                break;
            case "done":
                getAppraisedList({ appraisedState : "2", ...params });
                break;
            case "todo":
                getAppraisedList({ appraisedState : "0", ...params });
                break;
            default:
                break;
        }
    }

    /**
     * 通过名字搜索版本
     * @param {*} values
     */
    const onSearch = (data) => {
        findAppraised({ name: data })
        // 重置分页参数，从第一页开始搜索
        // setPageParam({ current: 1, pageSize: 10 })
    };

    /**
     * 获取版本列表，带分页
     */
    const findAppraised = (value) => {
        setLoading(true)
        getAppraisedList(value).then((res) => {
            setLoading(false)
        })
    }

    // 初始化
    useEffect(() => {
        getAppraisedList({ projectId: projectId, name: null, appraisedState: null })
        selectTabs(activeTabs, 1);
        getUserList(projectId);
        // console.log(JSON.stringify(userList));
        return;
    }, []);

    const goDetail = (id, name) => {
        console.log("id:  " + id + "name:  " + name)
        // const params = {
        //     name: name,
        //     model: "appraised",
        //     modelId: id,
        //     project: { id: project.id },
        //     projectType: { id: project.projectType.id },
        // }
        // createRecent(params)

        props.history.push({ pathname: `/${projectId}/appraised/${id}/workitem` })
        localStorage.setItem("sprintId", id);
    };

    // 加载中
    const [loading, setLoading] = useState(false)
    // 列表的列
    const columns = [
        {
            title: "评审名称",
            dataIndex: "name",
            key: "name",
            width: "25%",
            render: (text, record) => (
                <div className="appraised-master" onClick={() => goDetail(record.id, text)}>
                    <ColorIcon name={text} className="icon-32" color={record.color} />
                    <span className="appraised-name" >{text}</span>
                </div>

            ),
        },
        {
            title: "评审周期",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <span>
                {record.startTime?.slice(0, 10)} ~ {record.endTime?.slice(0, 10)}
            </span>
        },
        {
            title: "状态",
            dataIndex: "appraisedState",
            key: "appraisedState",
            align: "left",
            render: (text, record) => <div className={`appraised-status ${setStatuStyle(record.appraisedState)}`}>
                {status[text].name}
            </div>
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            align: "left"
        },
        {
            title: "创建者",
            dataIndex: "builder",
            key: "builder",
            align: "left",
            render: (text, record, index) => <Space>
                <UserIcon userInfo={record.builder?.id} name={record.builder?.nickname} />
                {record.builder?.nickname}
            </Space>,
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record, index) => (
                <Space size="middle">
                    {/*<PrivilegeProjectButton code={'ProjectVersionDelete'} domainId={projectId}  {...props}>*/}
                    <AppraisedAddModal
                        name="编辑评审"
                        type="edit"
                        id={record.id}
                        // findVersion={findVersion}
                        getUserList={getUserList}
                        userList={userList}
                        setActiveTabs={setActiveTabs}
                        selectTabs={selectTabs}
                        {...props}
                    />
                    <DeleteModal deleteFunction={deleteAppraisedList} id={record.id} />
                    {/*</PrivilegeProjectButton>*/}
                </Space>

            ),
        },
    ];

    const deleteAppraisedList = (id) => {
        deleteAppraised(id).then(res => {
            if (res.code === 0) {
                selectTabs(activeTabs, 1)
            }
        })
    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "0":
                name = "appraised-status-todo";
                break;
            case "1":
                name = "appraised-status-process";
                break;
            case "2":
                name = "appraised-status-done";
                break;
            default:
                name = "appraised-status-process";
                break;
        }
        return name;
    }

    const changePage = (page, pageSize) => {
        selectTabs(activeTabs, page)
    }

    return (
        <Provider {...store}>
            {/*<>项目评审列表</>*/}
            <div className={`project-appraised`}>
                <Row >
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                        <div className="project-appraised-list">
                            <Breadcumb firstText="评审">
                                {/*<PrivilegeProjectButton code={'ProjectAppraisedAdd'} domainId={projectId}  {...props}>*/}
                                <AppraisedAddModal
                                    name="添加评审"
                                    type="add"
                                    id="0"
                                    // findVersion={findVersion}
                                    getUserList={getUserList}
                                    userList={userList}
                                    setActiveTabs={setActiveTabs}
                                    selectTabs={selectTabs}
                                    {...props}
                                />
                                {/*</PrivilegeProjectButton>*/}
                            </Breadcumb>
                            <div className="appraised-filter">
                                <div className="appraised-tabs">
                                    {
                                        appraisedTab.map(item => {
                                            return <div
                                                className={`appraised-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                                key={item.key}
                                                onClick={() => selectTabs(item.key, 1)}
                                            >
                                                {item.title}
                                            </div>
                                        })
                                    }
                                </div>
                                <div className="appraised-filter-right">
                                    <InputSearch
                                        placeholder="搜索评审"
                                        allowClear
                                        style={{ width: 200 }}
                                        onChange={onSearch}
                                    />
                                </div>
                            </div>
                            <div className="project-appraised-contant">
                                <div className="appraised-table-box">
                                    <Table
                                        columns={columns}
                                        dataSource={appraisedList}
                                        rowKey={(record) => record.id}
                                        pagination={{
                                            total: total,
                                            pageSize: searchCondition?.pageParam?.pageSize,
                                            current: searchCondition?.pageParam?.currentPage,
                                            onChange: changePage,
                                            position: ["bottomCenter"],
                                            hideOnSinglePage: true,
                                            simple: true
                                        }}
                                        loading={loading}
                                        onSearch={onSearch}
                                        scroll={{ x: "100%" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Provider>

    )
}

export default withRouter(observer(AppraisedTable));