import React, { useEffect, useState } from "react";
import "./WorkPrivilegeList.scss";
import { observer } from "mobx-react";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { Table } from "antd";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import WorkPrivilegeAddModal from "./WorkPrivilegeAddModal";

const WorkPrivilegeList = (props) => {
    const { findWorkPrivilegeList } = WorkPrivilegeStore;
    const [workPrivilegeList, setWorkPrivilegeList] = useState()

    useEffect(() => {
        getList();
        return;
    }, [])

    const getList = () => {
        findWorkPrivilegeList({}).then(res => {
            if (res.code === 0) {
                setWorkPrivilegeList(res.data)
            }
        })
    }

    const goRoleList = (id) => {
        props.history.push(`/setting/workPrivilegeRoleList/${id}`)
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <span className="role-table-name" onClick={() => goRoleList(record.id)}>{text}</span>,
        },
        {
            title: '分组',
            dataIndex: 'grouper',
            key: 'grouper',
            render: (text, record) => <span className="role-table-name">{text === "system" ? "系统" : "自定义"}</span>,
        }
    ];

    return (
        <div className="work-privilege">
            <Breadcrumb
                firstText="事项权限"
            >
                <WorkPrivilegeAddModal getList = {getList} />
            </Breadcrumb>
            <div className="work-privilege-list">
                <Table columns={columns} dataSource={workPrivilegeList} rowKey={record => record.id} />
            </div>
        </div>
    )
}

export default observer(WorkPrivilegeList);