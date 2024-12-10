import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import { Table, Tabs } from "antd";
import "./WorkRoleList.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";
import { withRouter } from "react-router";

const WorkRoleList = (props) => {
    const projectId = props.match.params.id;
    const workTypeId = props.match.params.workTypeId;
    const { findRolePageAndRoleUserNumber, findVRolePage, findWorkType, 
        findDmRolePageByNumber, findWorkTypeDm } = WorkPrivilegeStore;
    const [roleList, setRoleList] = useState();
    const [workTypeInfo, setWorkTypeInfo] = useState();
    
    useEffect(() => {
        // 获取事项类型信息
        if(projectId){
            findWorkTypeDm({id: workTypeId}).then(res => {
                if(res.code === 0){
                    setWorkTypeInfo(res.data.workType)
                    console.log(res.data.workType)
                }
            })
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
            findWorkType({id: workTypeId}).then(res => {
                if(res.code === 0){
                    console.log(res.data)
                    setWorkTypeInfo(res.data)
                }
            })
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

    const goRoleFunction = (record) => {
        if(projectId){
            props.history.push({pathname: `/project/${projectId}/set/rolefunction/${workTypeId}/${record.id}`,search:`?roleName=${record.name}`})
        }else {
            // props.history.push(`/setting/workRoleFunction/${privilegeId}/${type}/${id}`)
            props.history.push({pathname:`/setting/workRoleFunction/${workTypeId}/${record.id}`
                ,search:`?roleName=${record.name}`});
        }
        
    }
    const roleColumns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <span className="role-table-name" onClick={() => goRoleFunction(record)}>{text}</span>,
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
                firstText={workTypeInfo?.name}
                secondText = "角色"
            />
            <Table columns={roleColumns} dataSource={roleList} rowKey={record => record.id} scroll={{x: "100%"}}/>
        </div>
    )
}

export default withRouter(observer(WorkRoleList));
