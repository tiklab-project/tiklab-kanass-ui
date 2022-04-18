import React, { Fragment } from "react";
import { Breadcrumb, Input, Table, Space, Select, Divider } from 'antd';
import ProjectAddmodal from "./projectAdd";
import { observer, inject } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import {getDomainTenant} from 'doublekit-core-ui';
const { Search } = Input;
const { Option } = Select;

const Procontent = (props) => {
    const { workStore,proStore } = props;
    const { getProlist, prolist,projectPageParams,updateProject } = proStore;
    const tenant = getDomainTenant();

    const status = [
        {
            name: "未开始",
            id: "1"
        },
        {
            name: "进行中",
            id: "2"
        },
        {
            name: "已结束",
            id: "3"
        }
    ]
    const columns = [
        {
            title: "项目名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            render: (text, record) => <span onClick={() => goProdetail(record.id,record.projectType.id)} className="span-botton">
                <img src={`${img_url}/file/${record.iconUrl}?tenant=${tenant}`} width = "30px" height="30px" alt="" />
                {text}
            </span>,
        },
        {
            title: "项目编码",
            dataIndex: "id",
            key: "id",
            align: "center",

        },
        {
            title: "项目类型",
            dataIndex: ["projectType", "name"],
            key: "projectType",
            align: "center",
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "center",
        },
        {
            title: "计划开始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
        },
        {
            title: "计划结束时间",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
        },
        {
            title: "项目状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "center",
            render: (text,record) => (
                <Select 
                    defaultValue={text} 
                    style={{ width: 120 }} 
                    bordered={false}
                    onChange={(value)=>changeState(value,record.id)}
                    showArrow = {false}
                >
                {
                    status.map(item => {
                        return <Option value={item.id} key={item.id}>{item.name}</Option>
                    })
                }
                </Select>
            )
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
            align: "center"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <ProjectAddmodal
                        type="edit"
                        id={record.id}
                        name="编辑"
                    />
                </Space>
            )
        }
    ];

    const changeState = (value,projectId) => {
        let params = {
            id: projectId,
            projectState: value
        }
        updateProject(params)
    }

    const goProdetail = (id,projectTypeId) => {
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", projectTypeId);
        workStore.setWorkId("")
        props.history.push({ pathname: "/index/prodetail/survey" })
    };

    const onSearch = value => {
        getProlist({ name: value })
    };

    const handleTableChange = (pagination) => {
        getProlist({ current: pagination.current })
    };

    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">项目列表</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
                <div className="search-add">
                    <Search
                        placeholder="请输入关键字"
                        allowClear
                        onSearch={(value) => onSearch(value)}
                        style={{ width: 300 }}
                    />
                    <ProjectAddmodal
                        name="添加项目"
                        type="add"
                    />
                </div>
                <div className="table-box">
                    <Table
                        columns={columns}
                        dataSource={prolist}
                        rowKey={record => record.id}
                        onChange={handleTableChange}
                        pagination={{ ...projectPageParams }}
                    />
                </div>
        </Fragment>
    )
}
export default inject('workStore','proStore')(withRouter(observer(Procontent)));