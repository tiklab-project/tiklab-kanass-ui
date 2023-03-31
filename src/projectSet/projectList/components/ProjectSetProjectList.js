/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-17 13:20:21
 */
import React, { useEffect, useState } from 'react';
import { Table, Space, Select, Row, Col } from 'antd';
import "../components/ProjectSetProjectList.scss";
import ProjectSetRelevance from "./ProjectSetRelevance";
import { inject, observer } from 'mobx-react';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

import { withRouter } from 'react-router';

const ProjectSetProjectList = (props) => {
    const { projectSetStore } = props;
    const { findProjectList, updateProject, projectRelevance, findAllProjectSet } = projectSetStore;
    const [projectSetId, setProjectSetId] = useState(props.match.params.projectSetId);
    const [projectSetAllList, setProjectSetAllList] = useState()
    useEffect(() => {
        findAllProjectSet().then(res => {
            setProjectSetAllList(res.data)
        })
        findProjectList({ projectSetId: projectSetId })
        return;
    }, [projectSetId])

    /**
     * 删除项目集
     * @param {*} id 
     */
    const deleProjectSet = (id) => {
        const values = {
            id: id,
            projectSetId: "nullString"
        }

        updateProject(values).then((data) => {
            if (data.code === 0) {
                findProjectList(projectSetId)
            }
        })

    }

    /**
     * 切换项目集
     * @param {*string} value 
     */
    const changeProjectSet = (value) => {
        props.history.push(`/index/projectSetDetail/${value}`)
        setProjectSetId(value)
    }

    const goProdetail = (project) => {
        localStorage.setItem("project", JSON.stringify(project));
        localStorage.setItem("projectId", project.id);
        localStorage.setItem("projectTypeId", project.projectType.id);

        if (project.projectType.type === "scrum") {
            props.history.push(`/index/projectScrumDetail/${project.id}/survey`)
        }
        if (project.projectType.type === "nomal") {
            props.history.push(`/index/projectNomalDetail/${project.id}/survey`)
        }

    };

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            render: (text, record) => <div className="project-name" onClick={() => goProdetail(record)} >
                    <div className="project-icon">
                        {
                            record.iconUrl ?
                                <img
                                    src={('/images/' + record.iconUrl)}
                                    alt="" 
                                    className="list-img"
                                />
                                :
                                <img
                                    src={('/images/project1.png')}
                                    alt=""
                                    className="list-img"
                                />
                        }

                    </div>
                    <div>
                        <div className="project-key">{record.projectKey}</div>
                        <div className="project-text">{text}</div>
                    </div>
                    
                </div>
        },
        {
            title: "项目类型",
            width: "20%",
            dataIndex: ["projectType", "name"],
            key: "projectType",
            align: "left",
            render: (text, record) =>
                <div className="project-name">
                    <div >{text}</div>
                </div>
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "left",
            width: "8%"
        },
        {
            title: "状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "left",
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
            title: "计划时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "20%",
            render: (text, record) => (
                <>
                   {record.startTime} - {record.endTime}
                </>
            )
        },
        {
            title: "事项完成/总数量",
            dataIndex: "worklItemNumber",
            key: "worklItemNumber",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <>
                   {record.quantityNumber} / {record.worklItemNumber}
                </>
            )
        },
        {
            title: "成员",
            dataIndex: "member",
            key: "member",
            align: "left",
            width: "5%"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "left",
            width: "5%",
            render: (text, record) => (
                <Space size="middle">
                    <span className="span-botton  delete" onClick={() => deleProjectSet(record.id)}>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
                    </span>
                </Space>
            )
        }
    ]

    // 子表的列数据
    const workColumns = [
        {
            key: "title",
            align: "left",
            render: (text, record) => <div style={{ width: "17px", height: "16px" }}></div>
        },
        {
            title: "名称",
            dataIndex: "sprintName",
            key: "title",
            align: "left",
            width: "10%",
            render: (text, record) => <span className="span-botton">
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-project"></use>
                </svg>
                {text}
            </span>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "left",
            width: "8%"
        },
        {
            title: "状态",
            dataIndex: ["sprintState", "name"],
            key: "workStatus",
            align: "left",
            width: "8%"

        },
        {
            title: "计划开始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "8%"
        },
        {
            title: "计划结束时间",
            dataIndex: "endTime",
            key: "endTime",
            align: "left",
            width: "8%"
        },
        {
            title: "进度",
            dataIndex: "percent",
            key: "percent",
            align: "left",
            width: "5%"
        },
        {
            title: "事项数量",
            dataIndex: "workNum",
            key: "workNum",
            align: "left",
            width: "5%"
        },
        {
            title: "完成数量",
            dataIndex: "endNum",
            key: "endNum",
            align: "left",
            width: "5%"
        },
        {
            title: "成员",
            dataIndex: "member",
            key: "member",
            align: "left",
            width: "5%"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "left",
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

    return <Row>
        <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
            <div className="projectSetDetail">
                <Breadcumb
                    firstText="项目集列表"
                    secondText="关联项目"
                    firstUrl="/index/projectSet/projectSetList"
                >
                    {/* <PrivilegeButton code={'RelationProject'} domainId={projectSetId}  {...props}> */}
                        <ProjectSetRelevance projectSetId={projectSetId}>关联项目</ProjectSetRelevance>
                    {/* </PrivilegeButton> */}

                </Breadcumb>
                <div style={{ padding: "20px 0" }}>
                    <div className="search-add">
                        <div>
                            <Select defaultValue="项目集列表" style={{ width: 120 }} onChange={(value) => changeProjectSet(value)}>
                                {
                                    projectSetAllList && projectSetAllList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="table-box">
                        {
                            console.log(projectRelevance)
                        }
                        <Table
                            columns={columns}
                            dataSource={projectRelevance}
                            rowKey={record => record.id}
                            pagination={false}
                        />
                    </div>
                </div>

            </div>
        </Col>
    </Row>
}

export default withRouter(inject("projectSetStore")(observer(ProjectSetProjectList)));