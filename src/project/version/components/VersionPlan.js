import React, { useEffect, useState } from "react";
import { Tabs, Input, Table, Space, Button, Row, Col } from 'antd';
import VersionPlanAddmodal from "./VersionPlanAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { withRouter } from "react-router";
import InputSearch from "../../../common/input/InputSearch";
import WorkBorderDetail from "../../../work/components/workBorderDetail";
const { TabPane } = Tabs;
const { Search } = Input;

const VersionPlan = (props) => {
    const { versionPlanStore, workStore, actionPlanId } = props
    const { getSelectVersionPlanList, versionPlanList, selectVersionPlanList,
        addVersionPlan, deleVersionPlan, searchAllVersionPlan } = versionPlanStore;
    const projectId = props.match.params.id;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { setWorkId, setWorkIndex, setWorkShowType } = workStore;
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