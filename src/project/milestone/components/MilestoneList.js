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
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-user-ui";
import "../components/milestone.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import MilestoneTimeline from "./MilestoneTimeline"
import { withRouter } from "react-router";

const MilestoneList = (props) => {
    // 解析 props
    const { milestoneStore } = props;
    // 解析 milestoneStore
    const { milestonelist, findMilestonePage, deleMilestone, milestonePageParam, setPageParam
    } = milestoneStore;

    // 项目id
    const projectId = props.match.params.id;

    // 加载中
    const [loading, setLoading] = useState(false)

    // 列表的列
    const columns = [
        {
            title: "里程碑名称",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "所属项目",
            dataIndex: ["project", "projectName"],
            key: "project.projectName",
            render: (text) => <span>{text}</span>,
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
                    <PrivilegeProjectButton code={'MilestoneDele'} disabled={"hidden"} domainId={projectId} {...props}>
                        {/* <Button
                            type="link"
                            onClick={() => deleMilestone(record.id, projectId)}
                        >
                            删除
                        </Button> */}
                        <svg className="svg-icon" aria-hidden="true" onClick={() => deleMilestone(record.id, projectId)} style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
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

    return (
        <div className="project-milestone">
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-milestone-list">
                        <Breadcumb
                            firstText="里程碑列表"
                        >
                            <MilestoneAddEditModal
                                name="添加里程碑"
                                type="add"
                                id="0"
                                {...props}
                            />
                        </Breadcumb>
                        <MilestoneTimeline milestonelist = {milestonelist}/>
                        <div className="project-milestone-contant">

                            <div className="table-box">
                                <Table
                                    columns={columns}
                                    dataSource={milestonelist}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    loading={loading}
                                    onSearch={onSearch}
                                    onChange={pageTurning}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

    );
};
export default withRouter(inject("systemRoleStore", "milestoneStore")(observer(MilestoneList)));
