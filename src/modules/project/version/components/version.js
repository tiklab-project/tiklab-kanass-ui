import React, { Fragment, useEffect } from "react";
import { Breadcrumb, Input, Table, Space, Button, Divider, Layout, Row, Col } from 'antd';
import VersionAddmodal from "./versionAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import "../components/version.scss"

const { Search } = Input;
const Version = (props) => {
    const { versionStore } = props
    const { getVersionList, versionList, addVersion, deleVersion, searchVersionById, editVersion, getVersionId } = versionStore
    const projectId = localStorage.getItem("projectId");

    useEffect(() => {
        getVersionList({ projectId: projectId })
    }, [])

    //删除用户
    const deleteVersion = (id) => {
        deleVersion({ id: id })
    }

    // 搜索用户
    const onSearch = (value) => {
        getVersionList({ name: value })
    }

    // 跳转规划页面
    const goPlan = (value) => {
        props.history.push({ pathname: "/index/prodetail/versionPlan" })
        getVersionId(value)
    }

    const setStatusName = (value) => {
        let name = ""
        switch (value) {
            case "0":
                name = "未开始"
                break;
            case "1":
                name = "进行中"
                break;
            case "2":
                name = "已结束"
                break;
            default:
                name = "未开始"
                break;
        }
        return name;
    }
    const columns = [
        {
            title: "版本名称",
            dataIndex: "name",
            key: "name",
            align: "center"
        },
        {
            title: "起始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "center"
        },
        {
            title: "发布日期",
            dataIndex: "publishDate",
            key: "publishDate",
            align: "center"
        },
        {
            title: "事项数",
            dataIndex: "workNum",
            key: "workNum",
            align: "center"
        },
        {
            title: "状态",
            dataIndex: "versionState",
            key: "versionState",
            align: "center",
            render: (text, record) => setStatusName(text)
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <VersionAddmodal
                        name="编辑版本"
                        type="edit"
                        id={record.id}
                        projectId={projectId}
                        searchVersionById={searchVersionById}
                        editVersion={editVersion}
                    />
                    <PrivilegeProjectButton code={'VersionDelet'} disabled={"hidden"} domainId={projectId}>
                        <Button type="link" onClick={() => deleteVersion(record.id)}>
                            删除
                        </Button>
                    </PrivilegeProjectButton>

                    <PrivilegeProjectButton code={'VersionPlan'} disabled={"disable"} domainId={projectId}>
                        <Button type="link" onClick={() => goPlan(record.id)}>
                            规划事项
                        </Button>
                    </PrivilegeProjectButton>
                </Space>
            ),
        },
    ];
    return (
        <div className="project-version">
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">版本管理</a>
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
                <VersionAddmodal
                    name="添加版本"
                    type="add"
                    versionList={versionList}
                    addVersion={addVersion}
                    projectId={projectId}
                ></VersionAddmodal>
            </div>
            <div className="table-box">
                <Table
                    columns={columns}
                    dataSource={versionList}
                    rowKey={record => record.id}
                />
            </div>
        </div>
    )
}
export default inject("versionStore")(observer(Version));