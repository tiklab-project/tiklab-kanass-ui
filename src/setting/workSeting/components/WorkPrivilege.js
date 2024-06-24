import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import { Table, Tabs } from "antd";
import "./WorkPrivilege.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";

const Workpriority = (props) => {
    const {findRolePageAndRoleUserNumber, findVRolePage} = WorkPrivilegeStore;
    const [roleList, setRoleList] = useState();
    const [vroleList, setVroleList] = useState();



    useEffect(()=> {
        findRolePageAndRoleUserNumber({}).then(res => {
            if(res.code === 0){
                setRoleList(res.data.dataList)
            }
        })

        findVRolePage().then(res => {
            if(res.code === 0){
                setVroleList(res.data.dataList)
            }
        })
    }, [])

    const goRoleFunction = (id) => {
        props.history.push(`/setting/workRoleFunction/${id}`)
    }
    const roleColumns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =><span className="role-table-name" onClick={() => goRoleFunction(record.id)}>{text}</span>,
        },
        {
            title: '成员数',
            dataIndex: 'roleUserNumber',
            key: 'roleUserNumber',
        },
        {
            title: '类型',
            dataIndex: 'group',
            key: 'group',
            render: (text) => <a>{text === "system" ? "系统" : "自定义"}</a>,
        },

    ];
    

    const vroleColumns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =><span className="role-table-name" onClick={() => goRoleFunction(record.id)}>{text}</span>,
        },
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
        },

    ];
    return (
        <div className="work-privilege">
            <Breadcrumb
                firstText="事项权限"
            />
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="角色" key="1">
                    <Table columns={roleColumns} dataSource={roleList} rowKey={record=> record.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="虚拟角色" key="2">
                    <Table columns={vroleColumns} dataSource={vroleList} rowKey={record=> record.id} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default observer(Workpriority);