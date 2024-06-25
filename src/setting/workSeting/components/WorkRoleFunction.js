import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import "./WorkRoleFunction.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";
import WorkFunctionPrivilege from "./WorkFunctionPrivilege";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";

const WorkRoleFunction = (props) => {
    const roleId = props.match.params.roleId;
    const roleType = props.location.state.type;
    const privilegeId = props.location.state.privilegeId;
    console.log(props)
    useEffect(() => {
        // findRolePageAndRoleUserNumber({}).then(res => {
        //     if (res.code === 0) {
        //         setRoleList(res.data.dataList)
        //     }
        // })

        // findVRolePage().then(res => {
        //     if (res.code === 0) {
        //         setVroleList(res.data.dataList)
        //     }
        // })
    }, [])
    return (
        <div className="work-role-function">
            {/* <div className="work-role-function-crumb" >
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-pageLeft"></use>
                </svg>
                角色
            </div> */}
            <Breadcrumb firstText="事项权限" secondText="admin" />
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="功能权限" key="1">
                    <WorkFunctionPrivilege roleId = {roleId} roleType = {roleType} privilegeId = {privilegeId}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="字段权限" key="2">
                    表单权限
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default observer(WorkRoleFunction);