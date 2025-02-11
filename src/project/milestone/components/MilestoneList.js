/*
 * @Descripttion: 里程碑列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Row, Col } from "antd";
import MilestoneAddEditModal from "./MilestoneAddEditModal";
import { observer, Provider } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "./milestoneList.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import MilestoneTimeline from "./MilestoneTimeline"
import { withRouter } from "react-router";
import MilestoneStore from "../store/MilestoneStore"
import DeleteModal from "../../../common/deleteModal/deleteModal";
const MilestoneList = (props) => {
    // 解析 props
    const store = {
        milestoneStore: MilestoneStore
    }
    // 解析 milestoneStore
    const { milestonelist, findMilestonePage, deleMilestone, setPageParam
    } = MilestoneStore;

    // 项目id
    const projectId = props.match.params.id;

    // 加载中
    const [loading, setLoading] = useState(false)
    const statusList = ["未开始", "进行中", "已结束"]
    // 列表的列
    const columns = [
        {
            title: "里程碑名称",
            dataIndex: "name",
            key: "name"
        },
        // {
        //     title: "状态",
        //     dataIndex: ["project", "projectName"],
        //     key: "project.projectName",
        //     render: (text) => <span>{text}</span>,
        // },
        {
            title: "状态",
            dataIndex: "milestoneStatus",
            key: "milestoneStatus",
            render: (text) => <span>{statusList[text]}</span>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "left",
        },
        {
            title: "里程碑日期",
            dataIndex: "milestoneTime",
            key: "milestoneTime",
            align: "left",
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record) => (
                <Space size="middle">
                    <MilestoneAddEditModal
                        name="编辑"
                        type="edit"
                        id={record.id}
                        {...props}
                    />
                    <PrivilegeProjectButton code={'MilestoneDele'} disabled={"hidden"} domainId={projectId}  {...props}>
                        <DeleteModal deleteFunction={deleMilestone} id={record.id} />
                    </PrivilegeProjectButton>

                </Space>
            ),
        },
    ];

    // 初始化
    useEffect(() => {
        findMilestone({ projectId: projectId })
        return;
    }, []);

    /**
     * 获取里程碑列表，带分页
     */
    const findMilestone = (value) => {
        setLoading(true)
        findMilestonePage(value).then(() => {
            setLoading(false)
        })
    }

    /**
     * 通过名字搜索里程碑
     * @param {*} values 
     */
    const onSearch = (data) => {
        findMilestone({ name: data.target.value })
        // 重置分页参数，从第一页开始搜索
        setPageParam({ current: 1, pageSize: 10 })
    };

    /**
     * 翻页
     * @param {*} pagination 
     */
    const pageTurning = (pagination) => {
        setPageParam(pagination)
    }

    return (<Provider {...store}>
        <div className="project-milestone">
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-milestone-list">
                        <Breadcumb
                            firstText="里程碑"
                        >
                            <MilestoneAddEditModal
                                name="添加里程碑"
                                type="add"
                                id="0"
                                {...props}
                            />
                        </Breadcumb>
                        <MilestoneTimeline milestonelist={milestonelist} />
                        <div className="project-milestone-contant">

                            <div className="milestone-table-box">
                                <Table
                                    columns={columns}
                                    dataSource={milestonelist}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    loading={loading}
                                    onSearch={onSearch}
                                    onChange={pageTurning}
                                    scroll={{ x: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </Provider>


    );
};
export default withRouter(observer(MilestoneList));
