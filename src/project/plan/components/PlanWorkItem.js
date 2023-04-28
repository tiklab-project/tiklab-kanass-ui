/*
 * @Descripttion: 计划的事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 15:27:15
 */
import React, { useEffect } from "react";
import { Breadcrumb, Input, Table, Space, Button, Divider, Layout, Row, Col, } from 'antd';
import PlanWorkItemAddmodal from "./PlanWorkItemAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "./Plan.scss"

const { Search } = Input;
const PlanWorkItem = (props) => {
    const { planWorkItemStore } = props
    const { getWorkItemList, planWorkItemList,
        addPlanWorkItem, delePlanWorkItem } = planWorkItemStore;
    const planId = props.match.params.id;
    const projectId = props.match.params.id;

    useEffect(() => {
        getWorkItemList({ projectId: projectId, planId: planId })
        return;
    }, [])


    //删除事项
    const deletePlanWorkItem = (id) => {
        delePlanWorkItem({ workItem: { id: id }, planId: planId }).then(res => {
            if (res.code === 0) {
                getWorkItemList()
            }
        })
    }


    // 搜索用户
    const onSearch = (value) => {
        getSelectPlanWorkItemList({ title: value })
    }


    const columns = [
        {
            title: "事项名称",
            dataIndex: "title",
            key: "title"
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
                    <PrivilegeProjectButton code={'PlanWorkDele'} disabled={"hidden"} domainId={projectId}  {...props}>
                        <Button type="link" onClick={() => deletePlanWorkItem(record.id)}>
                            删除
                        </Button>
                    </PrivilegeProjectButton>
                </Space>
            ),
        },
    ];


    return (
        <div className="plan-workitem">
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/plan">版本管理</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/planPlan">规划事项</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="search-add">
                <Search
                    placeholder="请输入事项名称"
                    allowClear
                    style={{ width: 200, margin: '0 10px' }}
                    onSearch={onSearch}
                />
                <PlanWorkItemAddmodal
                    name="添加规划"
                    type="add"
                    addPlanWorkItem={addPlanWorkItem}
                    planId={planId}
                ></PlanWorkItemAddmodal>
            </div>
            <Table
                columns={columns}
                dataSource={planWorkItemList}
                rowKey={record => record.id}
                pagination = {false}
            />

        </div>

    )
}
export default inject("systemRoleStore","planWorkItemStore", "planStore")(observer(PlanWorkItem));