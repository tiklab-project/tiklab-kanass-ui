import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import "./WorkRoleFunction.scss";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import { observer } from "mobx-react";
import WorkFunctionPrivilege from "./WorkFunctionPrivilege";

const WorkRoleFunction = () => {
    const { findRolePageAndRoleUserNumber, findVRolePage } = WorkPrivilegeStore;
    const [roleList, setRoleList] = useState();
    const [vroleList, setVroleList] = useState();


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
            <div className="work-role-function-crumb" >
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-pageLeft"></use>
                </svg>
                角色</div>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="角色" key="1">
                    <WorkFunctionPrivilege />
                </Tabs.TabPane>
                <Tabs.TabPane tab="虚拟角色" key="2">
                    表单权限
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default observer(WorkRoleFunction);