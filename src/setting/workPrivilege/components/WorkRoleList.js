import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import { Table, Tabs } from "antd";
import "./WorkRoleList.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";
import { withRouter } from "react-router";

const WorkRoleList = (props) => {
    const projectId = props.match.params.id;
    const privilegeId = props.match.params.privilegeId;
    const { findRolePageAndRoleUserNumber, findVRolePage, findWorkPrivilege, findDmRolePageByNumber } = WorkPrivilegeStore;
    const [roleList, setRoleList] = useState();
    const [privilege, setPrivilege] = useState()

    useEffect(() => {
        findWorkPrivilege({ id: privilegeId }).then(res => {
            if (res.code === 0) {
                setPrivilege(res.data)
            }
        })
        if(projectId){
            findDmRolePageByNumber({domainId: projectId}).then(res=> {
                if (res.code === 0) {
                    let list = res.data.dataList;
                    const roleList = []
                    list.map(item => {
                        const data = {
                            id: item.role.id,
                            name: item.role.name,
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
        }else {
            findRolePageAndRoleUserNumber({type: "2", group: "system"}).then(res => {
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
    
        }
        

    }, [])

    const goRoleFunction = (id, type) => {
        if(projectId){
            props.history.push(`/project/${projectId}/set/${privilegeId}/${type}/${id}`)
        }else {
            props.history.push(`/setting/workRoleFunction/${privilegeId}/${type}/${id}`)
        }
        
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


    return (
        <div className="work-privilege-role">
            <Breadcrumb
                firstText={privilege?.name}
                secondText = "角色"
            />
            <Table columns={roleColumns} dataSource={roleList} rowKey={record => record.id} scroll={{x: "100%"}}/>
        </div>
    )
}

export default withRouter(observer(WorkRoleList));