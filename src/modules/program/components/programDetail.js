/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 13:20:21
 */
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Space, Divider, Row, Col, Select } from 'antd';
import "../components/program.scss";
import ProgramRelevance from "./programRelevance";
import { inject, observer } from 'mobx-react';

const ProgramDetail = (props) => {
    const { programStore } = props;
    const { findProjectList, updateProject, projectRelevance, programAllList, findAllProjectSet } = programStore;
    const [programId, setProgramId] = useState(props.match.params.id);

    useEffect(() => {
        findAllProjectSet()
        findProjectList({ projectSetId: programId })
    }, [programId])

    /**
     * 删除项目集
     * @param {*} id 
     */
    const deleProgram = (id) => {
        const values = {
            id: id,
            projectSetId: 0
        }

        updateProject(values).then((data) => {
            if (data.code === 0) {
                findProjectList(programId)
            }
        })

    }

    /**
     * 切换项目集
     * @param {*string} value 
     */
    const changeProgram = (value) => {
        props.history.push(`/index/programDetail/${value}`)
        setProgramId(value)
    }

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "center",
            width: "10%",
            render: (text) => <span className="span-botton">
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon1_cheese"></use>
                </svg>
                {text}
            </span>,
        },
        {
            title: "编码",
            dataIndex: "id",
            key: "id",
            align: "center",
            width: "20%"
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "center",
            width: "8%"
        },
        {
            title: "状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "center",
            width: "8%",
            render: (text) => (() => {
                switch (text) {
                    case "1":
                        return <span>未开始</span>
                    case "2":
                        return <span>已开始</span>
                    case "3":
                        return <span>已结束</span>
                }
            })()
        },
        {
            title: "计划开始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
            width: "8%"
        },
        {
            title: "计划结束时间",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
            width: "8%"
        },
        {
            title: "进度",
            dataIndex: "percent",
            key: "percent",
            align: "center",
            width: "5%"
        },
        {
            title: "事项数量",
            dataIndex: "worklItemNumber",
            key: "worklItemNumber",
            align: "center",
            width: "5%"
        },
        {
            title: "完成数量",
            dataIndex: "quantityNumber",
            key: "quantityNumber",
            align: "center",
            width: "5%"
        },
        {
            title: "成员",
            dataIndex: "member",
            key: "member",
            align: "center",
            width: "5%"
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
            align: "center",
            width: "5%"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "center",
            width: "10%",
            render: (text, record) => (
                <Space size="middle">
                    <span className="span-botton  delete" onClick={() => deleProgram(record.id)}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconshanchu2-copy"></use>
                        </svg>
                        删除
                    </span>
                </Space>
            )
        }
    ]

    // 子表的列数据
    const workColumns = [
        {
            key: "title",
            align: "center",
            render: (text, record) => <div style={{ width: "17px", height: "16px" }}></div>
        },
        {
            title: "名称",
            dataIndex: "sprintName",
            key: "title",
            align: "center",
            width: "10%",
            render: (text, record) => <span className="span-botton">
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon1_cheese"></use>
                </svg>
                {text}
            </span>,
        },
        {
            title: "编码",
            dataIndex: "id",
            width: "20%",
            key: "id",
            align: "center",
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "center",
            width: "8%"
        },
        {
            title: "状态",
            dataIndex: ["sprintState", "name"],
            key: "workStatus",
            align: "center",
            width: "8%"

        },
        {
            title: "计划开始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
            width: "8%"
        },
        {
            title: "计划结束时间",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
            width: "8%"
        },
        {
            title: "进度",
            dataIndex: "percent",
            key: "percent",
            align: "center",
            width: "5%"
        },
        {
            title: "事项数量",
            dataIndex: "workNum",
            key: "workNum",
            align: "center",
            width: "5%"
        },
        {
            title: "完成数量",
            dataIndex: "endNum",
            key: "endNum",
            align: "center",
            width: "5%"
        },
        {
            title: "成员",
            dataIndex: "member",
            key: "member",
            align: "center",
            width: "5%"
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
            align: "center",
            width: "5%"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "center",
            width: "10%"
        }
    ]

    const workTable = (data) => {
        return <Table
            columns={workColumns}
            dataSource={data}
            rowKey={record => record.id}
            showHeader={false}
            pagination={false}
        />
    }

    return <div className="programDetail">
        <Breadcrumb>
            <Breadcrumb.Item>项目集列表</Breadcrumb.Item>
            <Breadcrumb.Item>
                <a href="/">项目集详情</a>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Divider />

        <div className="search-add">
            <div>
                <Select defaultValue="项目集列表" style={{ width: 120 }} onChange={(value) => changeProgram(value)}>
                    {
                        programAllList && programAllList.map((item) => {
                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        })
                    }
                </Select>
            </div>
            <ProgramRelevance programId={programId}>关联项目</ProgramRelevance>
        </div>

        <div className="table-box">
            <Table
                columns={columns}
                dataSource={projectRelevance}
                rowKey={record => record.id}
            // expandable={{
            //     expandedRowRender: record => workTable(record.sprintList),
            //     expandedRowClassName: record => "workTable"
            // }}
            />
        </div>
    </div>
}

export default inject('programStore')(observer(ProgramDetail));