/*
 * @Descripttion: 版本规划关联事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 16:39:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:13
 */

import React, { useEffect, useState } from "react";
import { Table, Space } from 'antd';
import VersionPlanAddmodal from "./VersionPlanAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-user-ui";
import { withRouter } from "react-router";
import InputSearch from "../../../common/input/InputSearch";
import WorkBorderDetail from "../../../work/components/WorkBorderDetail";


const VersionPlan = (props) => {
    const { versionPlanStore, workStore, actionPlanId } = props
    const { getSelectVersionPlanList, versionPlanList, selectVersionPlanList,
        addVersionPlan, deleVersionPlan, searchAllVersionPlan } = versionPlanStore;
    const { setWorkId, setWorkIndex, setWorkShowType } = workStore;
    // 项目id
    const projectId = props.match.params.id;
    // 显示事项详情抽屉
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    /**
     * 获取版本管理的事项
     */
    useEffect(() => {
        getSelectVersionPlanList({ projectId: projectId, versionId: actionPlanId })
        return
    }, [actionPlanId])


    /**
     * 删除规划的事项
     * @param {*} id 
     */
    const deleteVersionPlan = (id) => {
        deleVersionPlan({ id: id })
    }

    /**
     * 根据标题搜索版本的关联事项
     * @param {标题} value 
     */
    const onSearch = (value) => {
        getSelectVersionPlanList({ title: value })
    }

    /**
     * 显示事项详情抽屉
     * @param {事项id} id 
     * @param {*} index 
     */
    const goWorkItem = (id, index) => {
        setWorkIndex(index)
        setWorkId(id)
        setIsModalVisible(true)
        setWorkShowType("border")
    }
    const columns = [
        {
            title: "事项名称",
            dataIndex: "title",
            key: "title",
            render: (text, record, index) => (
                <span style={{ cursor: "pointer", color: "var(--tiklab-blue)" }} onClick = {() => goWorkItem(record.id, index)}>
                    {text}
                </span>
            )
        },
        {
            title: "类型",
            dataIndex: ["workTypeSys", "name"],
            key: "type"

        },
        {
            title: "事项状态",
            dataIndex: ["workStatusNode", "name"],
            key: "status",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    {/* <PrivilegeProjectButton code={'VersionDelete'} disabled={"hidden"} domainId={projectId}  {...props}>
                        <Button type="link" onClick={() => deleteVersionPlan(record.id)}>
                            删除
                        </Button>
                    </PrivilegeProjectButton> */}
                    {/* <svg className="svg-icon" aria-hidden="true" onClick={() => deleSprintList(item.id)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg> */}
                    <PrivilegeProjectButton code={'VersionDelete'} domainId={projectId}  {...props}>
                        <svg className="svg-icon" aria-hidden="true" onClick={() => deleteVersionPlan(record.id)} style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-delete"></use>
                        </svg>

                    </PrivilegeProjectButton>
                    

                </Space>
            ),
        },
    ];


    return (
        <div className="version-workitem">
            <div className="workitem-title">
                关联事项
                <VersionPlanAddmodal
                    name="添加规划"
                    type="add"
                    versionPlanList={versionPlanList}
                    addVersionPlan={addVersionPlan}
                    searchAllVersionPlan={searchAllVersionPlan}
                    actionPlanId={actionPlanId}
                    {...props}
                />
            </div>
            <div className="search-add">
                <InputSearch
                    placeholder="事项名称"
                    allowClear
                    style={{ width: 300 }}
                    onChange={onSearch}
                />

            </div>
            <Table
                columns={columns}
                dataSource={selectVersionPlanList}
                rowKey={record => record.id}
                pagination={false}
            />
             <WorkBorderDetail
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                {...props}
            />
        </div>
    )
}
export default withRouter(inject("systemRoleStore", "versionPlanStore", "workStore")(observer(VersionPlan)));