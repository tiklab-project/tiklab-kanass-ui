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
import { observer, inject, Provider } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { withRouter } from "react-router";
import InputSearch from "../../../common/input/InputSearch";
import WorkBorderDetail from "../../../work/components/WorkBorderDetail";
import VersionPlanStore from "../store/VersionPlanStores"
import WorkStore from "../../../work/store/WorkStore";
const VersionPlan = (props) => {
    const store = {
        versionPlanStore: VersionPlanStore
    }
    const { actionPlanId } = props
    const { findVersionWorkItemList, versionPlanList, selectVersionPlanList,
        addVersionPlan, deleVersionPlan, searchAllVersionPlan, workItemTotal,searchSelectWorkItemCondition } = VersionPlanStore;
    const { setWorkId, setWorkIndex, setWorkShowType } = WorkStore;
    // 项目id
    const projectId = props.match.params.id;
    // 显示事项详情抽屉
    const [isModalVisible, setIsModalVisible] = useState(false);

    /**
     * 获取版本管理的事项
     */
    useEffect(() => {
        findVersionWorkItemList({ projectId: projectId, versionId: actionPlanId })
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
        findVersionWorkItemList({ title: value })
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
                <>
                    {
                        record.workTypeSys?.iconUrl ?
                            <img
                                src={('images/' + record.workTypeSys?.iconUrl)}
                                alt=""
                                className="img-icon"
                            />
                            :
                            <img
                                src={('images/workType1.png')}
                                alt=""
                                className="img-icon"
                            />
                    }
                    <span style={{ cursor: "pointer", color: "var(--tiklab-blue)" }} onClick={() => goWorkItem(record.id, index)}>
                        {text}
                    </span>
                </>

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
            render: (text, record) => (
                <span className="version-work-status">
                    {text}
                </span>
            )
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

    const pageDown = (pagination) => {
        const params = {
            pageParam: {
                pageSize: 10,
                currentPage: pagination.current
            }
        }
        findVersionWorkItemList(params)
    }
    


    return (<Provider {...store}>
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
                pagination={{
                    hideOnSinglePage:true,
                    defaultCurrent: 1, 
                    total: workItemTotal,
                    pageSize: searchSelectWorkItemCondition.pageParam.pageSize,
                    currentPage: searchSelectWorkItemCondition.pageParam.currentPage,
                    position: ["bottomCenter"]
                }}
                onChange = {(pagination) => pageDown(pagination)}
            />
            <WorkBorderDetail
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                {...props}
            />
        </div>
    </Provider>
        
    )
}
export default withRouter(observer(VersionPlan));