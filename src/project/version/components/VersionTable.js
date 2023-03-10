/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Row, Col, DatePicker } from "antd";
import VersionAddmodal from "./VersionAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-user-ui";
import "./versionTable.scss";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch"
const { RangePicker } = DatePicker;

const VersionTable = (props) => {
    // 解析 props
    const path = props.match.path.split("/")[2];
    const { versionStore } = props
    const { versionList, getVersionList, deleVersion } = versionStore;

    // 项目id
    const projectId = props.match.params.id;

    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';

    // 加载中
    const [loading, setLoading] = useState(false)

    // 跳转到版本详情
    const goDetail = (id) => {
        props.history.push(`/index/${path}/${projectId}/versionDetail/${id}`)
    }

    const statusName = {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束"
    }

    // 列表的列
    const columns = [
        {
            title: "版本名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <span className="version-name" onClick={() => goDetail(record.id)}>{text}</span>
            ),
        },
        {
            title: "所属项目",
            dataIndex: ["project", "projectName"],
            key: "project.projectName",
            render: (text) => <span>{text}</span>,
        },

        {
            title: "开始日期",
            dataIndex: "startTime",
            key: "versionTime",
            align: "left",
        },
        {
            title: "发布日期",
            dataIndex: "versionState",
            key: "versionState",
            align: "left",
            render: (text) => <span>{statusName[text]}</span>,
        },
        {
            title: "状态",
            dataIndex: "versionState",
            key: "versionTime",
            align: "left",
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record) => (
                <Space size="middle">
                    <VersionAddmodal
                        name="编辑"
                        type="edit"
                        id={record.id}
                        {...props}
                    />
                    <PrivilegeProjectButton code={'VersionDelete'} domainId={projectId}  {...props}>
                        <span className="span-botton  delete" onClick={() => deleVersion(record.id)}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-delete"></use>
                            </svg>
                        </span>
                    </PrivilegeProjectButton>

                </Space>

            ),
        },
    ];

    // 初始化
    useEffect(() => {
        findVersion({ projectId: projectId })
        return;
    }, []);

    /**
     * 获取版本列表，带分页
     */
    const findVersion = (value) => {
        setLoading(true)
        getVersionList(value).then((res) => {
            setLoading(false)
        })
    }

    /**
     * 通过名字搜索版本
     * @param {*} values 
     */
    const onSearch = (data) => {
        console.log(data)
        findVersion({ name: data })
        // 重置分页参数，从第一页开始搜索
        // setPageParam({ current: 1, pageSize: 10 })
    };

    return (
        <div className="project-version">
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-version-list">

                        <Breadcumb
                            firstText="版本"
                        >
                            <VersionAddmodal
                                name="添加版本"
                                type="add"
                                id="0"
                                findVersion={findVersion}
                                {...props}
                            />
                        </Breadcumb>
                        
                        <div className="version-filter">
                            <InputSearch
                                placeholder="版本名称"
                                allowClear
                                style={{ width: 300 }}
                                onChange={onSearch}
                            />
                            <RangePicker
                                format={dateFormat}
                            />
                        </div>

                        <div className="project-version-contant">
                            <div className="table-box">
                                <Table
                                    columns={columns}
                                    dataSource={versionList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    loading={loading}
                                    onSearch={onSearch}
                                    onChange={false}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

    );
};
export default withRouter(inject("versionStore")(observer(VersionTable)));
