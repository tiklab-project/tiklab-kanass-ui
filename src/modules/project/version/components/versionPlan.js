import React, { useEffect } from "react";
import { Tabs, Input, Table, Space, Button, Divider, Layout, Row, Col } from 'antd';
import VersionPlanAddmodal from "./versionPlanAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
const { TabPane } = Tabs;
const { Search } = Input;

const VersionPlan = (props) => {
    const { versionPlanStore, versionStore,actionPlanId } = props
    const { getSelectVersionPlanList, versionPlanList, selectVersionPlanList,
        addVersionPlan, deleVersionPlan, searchAllVersionPlan } = versionPlanStore;
    const { versionId } = versionStore;
    const projectId = localStorage.getItem("projectId")
    useEffect(() => {
        getSelectVersionPlanList({ projectId: projectId, versionId: actionPlanId })
        return
    }, [actionPlanId])


    //删除用户
    const deleteVersionPlan = (id) => {
        deleVersionPlan({ id: id })
    }


    // 搜索用户
    const onSearch = (value) => {
        getSelectVersionPlanList({ title: value })
    }


    const columns = [
        {
            title: "事项名称",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "类型",
            dataIndex: ["workType", "name"],
            key: "type"

        },
        {
            title: "事项状态",
            dataIndex: ["workStatus", "name"],
            key: "status",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <PrivilegeProjectButton code={'VersionWorkDele'} disabled={"hidden"} domainId={projectId}>
                        <Button type="link" onClick={() => deleteVersionPlan(record.id)}>
                            删除
                        </Button>
                    </PrivilegeProjectButton>
                </Space>
            ),
        },
    ];


    return (
        <div className="version-plan">
            {/* <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/version">版本管理</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/versionPlan">规划事项</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider /> */}
            <Tabs type="card">
                <TabPane tab="关联事项" key="1">
                    <div className="search-add">
                        <Search
                            placeholder="请输入事项名称"
                            allowClear
                            style={{ width: 200, margin: '0 10px' }}
                            onSearch={onSearch}
                        />
                        <VersionPlanAddmodal
                            name="添加规划"
                            type="add"
                            versionPlanList={versionPlanList}
                            addVersionPlan={addVersionPlan}
                            searchAllVersionPlan={searchAllVersionPlan}
                            actionPlanId={actionPlanId}
                        ></VersionPlanAddmodal>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={selectVersionPlanList}
                        rowKey={record => record.id}
                    />
                </TabPane>
            </Tabs>


        </div>
    )
}
export default inject("versionPlanStore", "versionStore")(observer(VersionPlan));