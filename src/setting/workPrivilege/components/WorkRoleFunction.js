import React, { useEffect, useState } from "react";
import { Checkbox, Table, Tabs } from "antd";
import "./WorkRoleFunction.scss";
import { observer } from "mobx-react";
import WorkFunctionPrivilege from "./WorkFunctionPrivilege";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import WorkFieldPrivilege from "./WorkFieldPrivilege";
import { withRouter } from "react-router";

const WorkRoleFunction = (props) => {
    const { findWorkPrivilege, findRoleUserList, findRole, findVRole } = WorkPrivilegeStore;
    const roleId = props.match.params.roleId;
    const privilegeId = props.match.params.privilegeId;
    const roleType = props.match.params.roleType;
    const projectId = props.match.params.id;
    const [privilege, setPrivilege] = useState();
    const [workTypeId, setWorkTypeId] = useState();
    const [roleList, setRoleList] = useState();
    const [role, setRole] = useState();
    useEffect(() => {
        findWorkPrivilege({ id: privilegeId }).then(res => {
            if (res.code === 0) {
                const workTypeId = res.data.workTypeId;
                setWorkTypeId(workTypeId)
                setPrivilege(res.data)
            }
        })
        findRoleUserList({ id: roleId }).then(res => {
            if (res.code === 0) {
                setRoleList(res.data)
            }
        })
        if(roleType === "role"){
            findRole({id: roleId}).then(res => {
                if(res.code === 0){
                    setRole(res.data)
                }
            })
        }
        if(roleType === "virtualRole"){
            findVRole({id: roleId}).then(res => {
                if(res.code === 0){
                    setRole(res.data)
                }
            })
        }
        return
    }, [])


    const columns = [
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <a>{text || "---"}</a>,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text || "---"}</a>,
        }
    ];
    return (
        <div className="work-role-function">
            <Breadcrumb firstText="事项权限" secondText={role?.name} />
            <Tabs defaultActiveKey="1">
                {
                    roleType === "role" && <Tabs.TabPane tab="用户" key="1">
                        <Table
                            pagination={false}
                            columns={columns}
                            dataSource={roleList}
                            rowKey={r => r.id}
                            scroll={{x: "100%"}}
                        />
                    </Tabs.TabPane>
                }

                <Tabs.TabPane tab="功能权限" key="2">
                    <WorkFunctionPrivilege roleId={roleId} roleType={roleType} privilegeId={privilegeId} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="字段权限" key="3">
                    <WorkFieldPrivilege workTypeId={workTypeId} privilegeId={privilegeId} roleId={roleId} roleType={roleType} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default withRouter(observer(WorkRoleFunction));