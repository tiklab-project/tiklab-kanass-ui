import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import { Table, Tabs } from "antd";
import "./WorkPrivilegeRoleList.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";
import { withRouter } from "react-router";

const Workpriority = (props) => {
    const { findRolePageAndRoleUserNumber, findVRolePage, findWorkPrivilege } = WorkPrivilegeStore;
    const [roleList, setRoleList] = useState();
    const [vroleList, setVroleList] = useState();
    const privilegeId = props.match.params.privilegeId;
    const [privilege, setPrivilege] = useState()
    console.log(props)
    useEffect(() => {
        findWorkPrivilege({ id: privilegeId }).then(res => {
            if (res.code === 0) {
                setPrivilege(res.data)
            }
        })
        findRolePageAndRoleUserNumber({}).then(res => {
            if (res.code === 0) {
                let list = res.data.dataList;
                const roleList = []
                list.map(item => {
                    const data = {
                        id: item.id,
                        name: item.name,
                        roleType: "role",
                        type: "角色"
                    }
                    roleList.push(data)
                })


                findVRolePage().then(vrole => {
                    if (vrole.code === 0) {
                        // setVroleList(vrole.data.dataList)
                        list = vrole.data.dataList
                        list.map(item => {
                            const data = {
                                id: item.id,
                                name: item.name,
                                roleType: "virtualRole",
                                type: "虚拟角色"
                            }
                            roleList.push(data)
                        })
                        setRoleList(roleList)
                    }
                })
            }
        })


    }, [])

    const goRoleFunction = (id, roleType) => {
        props.history.push({pathname: `/setting/workRoleFunction/${id}`, state: {type: roleType, privilegeId: privilegeId}})
    }
    const roleColumns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <span className="role-table-name" onClick={() => goRoleFunction(record.id, record.roleType)}>{text}</span>,
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            // render: (text) => <a>{text === "system" ? "系统" : "自定义"}</a>,
        },

    ];


    const vroleColumns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <span className="role-table-name" onClick={() => goRoleFunction(record.id)}>{text}</span>,
        },
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
        }
    ];

    return (
        <div className="work-privilege-role">
            <Breadcrumb
                firstText="事项权限"
            />
            <Table columns={roleColumns} dataSource={roleList} rowKey={record => record.id} />
        </div>
    )
}

export default withRouter(observer(Workpriority));