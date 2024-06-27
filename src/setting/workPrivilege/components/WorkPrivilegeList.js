import React, { useEffect, useState } from "react";
import "./WorkPrivilegeList.scss";
import { observer } from "mobx-react";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { Table } from "antd";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import WorkPrivilegeAddModal from "./WorkPrivilegeAddModal";
import { withRouter } from "react-router";

const WorkPrivilegeList = (props) => {
    const projectId = props.match.params.id;
    const { findWorkPrivilegeList } = WorkPrivilegeStore;
    const [workPrivilegeList, setWorkPrivilegeList] = useState()

    useEffect(() => {
        getList();
        return;
    }, [])

    const getList = () => {
        const params = {
            projectId: projectId,
            scope: projectId ? "2" : "1"
        }
        findWorkPrivilegeList(params).then(res => {
            if (res.code === 0) {
                setWorkPrivilegeList(res.data)
            }
        })
    }

    const goRoleList = (id) => {
        if(projectId){
            props.history.push(`/projectDetail/${projectId}/projectSetDetail/projectPrivilegeRoleList/${id}`)
        }else {
            props.history.push(`/setting/workPrivilegeRoleList/${id}`)
        }
        
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

export default withRouter(observer(WorkPrivilegeList));