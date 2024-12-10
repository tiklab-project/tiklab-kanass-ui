import React, { useEffect, useState } from "react";
import { Checkbox, Table, Tabs } from "antd";
import "./WorkRoleFunction.scss";
import { observer } from "mobx-react";
import WorkFunctionPrivilege from "./WorkFunctionPrivilege";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import WorkPrivilegeStore from "../store/WorkPrivilegeStore";
import WorkFieldPrivilege from "./WorkFieldPrivilege";
import { withRouter } from "react-router";
import qs from "qs";

const WorkRoleFunction = (props) => {
    const { findWorkType, findWorkTypeDm } = WorkPrivilegeStore;
    const workTypeId = props.match.params.workTypeId;
    const search = props.location.search;
    const searchArray = qs.parse(search.replace(/^\?/, ''))
    const roleName = searchArray?.roleName;
    const [workTypeInfo, setWorkTypeInfo] = useState();
    const projectId = props.match.params.id;
    const [formId, setFormId] = useState()
    
    useEffect(() => {
        if(projectId){
            findWorkTypeDm({id: workTypeId}).then(res => {
                if(res.code === 0){
                    setWorkTypeInfo(res.data.workType)
                    setFormId(res.data.form.id)
                    console.log(res.data.workType)
                }
            })
        }else {
            findWorkType({id: workTypeId}).then(res => {
                if(res.code === 0){
                    console.log(res.data)
                    setWorkTypeInfo(res.data)
                    setFormId(res.data.form.id)
                }
            })
        }
        
        return null;
    }, [])


    return (
        <div className="work-role-function">
            <Breadcrumb firstText={workTypeInfo?.name} secondText={roleName} />
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="功能权限" key="2">
                    <WorkFunctionPrivilege workTypeId={workTypeId} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="字段权限" key="3">
                    <WorkFieldPrivilege workTypeId={workTypeId} formId = {formId}/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default withRouter(observer(WorkRoleFunction));