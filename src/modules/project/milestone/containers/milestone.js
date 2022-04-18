/*
 * @Descripttion: 里程碑列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Input, Table, Space, Button, Divider, Layout, Row, Col } from "antd";
import MilestoneAddmodal from "../components/milestoneAdd";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import "../components/milestone.scss"

const { Search } = Input;
const Milestone = (props) => {
    // 解析 props
    const { milestoneStore } = props;
    // 解析 milestoneStore
    const { milestonelist, findMilestonePage, deleMilestone, milestonePageParam, setPageParam
    } = milestoneStore;

    // 项目id
    const projectId = localStorage.getItem("projectId");

    // 加载中
    const [loading, setLoading] = useState(false)

    // 列表的列
    const columns = [
        {
            title: "里程碑名称",
            dataIndex: "name",
            key: "name",
            // render: (text, record) => (
            //     <Link to={`/index/milestonedetail/${record.id}`}>{text}</Link>
            // ),
        },
        {
            title: "所属项目",
            dataIndex: ["project", "projectName"],
            key: "project.projectName",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "id"],
            key: "master",
            align: "center",
        },
        {
            title: "里程碑日期",
            dataIndex: "milestoneTime",
            key: "milestoneTime",
            align: "center",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <MilestoneAddmodal
                        name="编辑"
                        type="edit"
                        id={record.id}
                    ></MilestoneAddmodal>
                    <PrivilegeProjectButton code={'MilestoneDele'} disabled={"hidden"} domainId={projectId}>
                        <Button
                            type="link"
                            onClick={() => deleMilestone(record.id, projectId)}
                        >
                            删除
                        </Button>
                    </PrivilegeProjectButton>
                </Space>
            ),
        },
    ];

    // 初始化
    useEffect(() => {
        findMilestone({ projectId: projectId })
        return null;
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
    const onSearch = (values) => {
        findMilestone({ name: values })
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
            <Breadcrumb>
                <Breadcrumb.Item>里程碑管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">里程碑详情</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="search-add">
                <Search
                    placeholder="input search text"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <MilestoneAddmodal
                    name="添加里程碑"
                    type="add"
                    id="0"
                ></MilestoneAddmodal>
            </div>
            <div className="table-box">
                <Table
                    columns={columns}
                    dataSource={milestonelist}
                    rowKey={(record) => record.id}
                    pagination={{ ...milestonePageParam }}
                    loading={loading}
                    onSearch={onSearch}
                    onChange={pageTurning}
                />
            </div>
        </div>
    );
};
export default inject("milestoneStore")(observer(Milestone));
