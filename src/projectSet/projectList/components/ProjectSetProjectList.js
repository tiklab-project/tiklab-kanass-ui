/*
 * @Descripttion: 项目集的项目列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:49:14
 */
import React, { useEffect, useState } from 'react';
import {Table, Space, Select, Row, Col, Tooltip, Progress} from 'antd';
import "../components/ProjectSetProjectList.scss";
import ProjectSetRelevance from "./ProjectSetRelevance";
import { Provider, observer } from 'mobx-react';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import { withRouter } from 'react-router';
import ProjectSetProjectStore from "../store/ProjectSetProjectStore";
import DeleteModal from '../../../common/deleteModal/deleteModal';
import ImgComponent from '../../../common/imgComponent/ImgComponent';
import { PrivilegeProjectButton } from 'tiklab-privilege-ui';
import UserIcon from "../../../common/UserIcon/UserIcon";
import CircleProgress from "../../../common/progress/CircleProgress";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
const ProjectSetProjectList = (props) => {
    const store = {
        projectSetProjectStore: ProjectSetProjectStore
    }
    const { findProjectPage, updateProject, projectRelevance, total, projectPageParams } = ProjectSetProjectStore;
    const [projectSetId, setProjectSetId] = useState(props.match.params.projectSetId);
    useEffect(() => {
        findProjectPage({ projectSetId: projectSetId })
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
                findProjectPage(projectSetId)
            }
        })

    }

    const goProdetail = (project) => {
        localStorage.setItem("project", JSON.stringify(project));
        localStorage.setItem("projectId", project.id);
        localStorage.setItem("projectTypeId", project.projectType.id);

        props.history.push(`/project/${project.id}/workitem`)

    };

    const status = {
        1: "未开始",
        2: "进行中",
        3: "已结束",
    }
    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            render: (text, record) => <div className="project-name" onClick={() => goProdetail(record)} >
                <div className="project-icon">
                    <ColorIcon color={record?.color} name={record.projectName} className={"img-32"} />
                </div>
                <div>
                    {
                        text.length > 10 ?
                            <Tooltip title={text}>
                                <div className="project-text">{text.substring(0, 10) + "..."}</div>
                            </Tooltip>
                            :<div className="project-text">{text}</div>
                    }
                </div>

            </div>
        },
        {
            title: "项目类型",
            width: "15%",
            dataIndex: ["projectType", "name"],
            key: "projectType",
            align: "left",
            render: (text, record) =>
                <div className="project-name">
                    <div >{text.substring(0,2)}</div>
                </div>
        },
        {
            title: "项目状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <div className={`project-status project-status${text === "1" ? "-todo" : text === "2" ? "-process" : "-done"}`}>{status[text]}</div>
            )
        },
        {
            title: "项目进度",
            dataIndex: "workItemNumber",
            key: "workItemNumber",
            align: "left",
            render: (text, record) => (
                <>
                    <CircleProgress
                        percent={
                            record.workItemNumber === 0 ? 0 :
                                (100 * record.endWorkItemNumber / record.workItemNumber)
                        }
                    />
                </>
            )
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            width: "8%",
            render: (text, record) => (
                <Space>
                    <UserIcon name={text} />
                    {text}
                </Space>
            )
        },
        {
            title: "计划时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => (
                <>
                    {record.startTime} - {record.endTime}
                </>
            )
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "left",
            width: "5%",
            render: (text, record) => (
                <Space size="middle">
                    {/* <span className="span-botton  delete" onClick={() => deleProjectSet(record.id)}>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
                    </span> */}
                    <DeleteModal deleteFunction={deleProjectSet} id={record.id} />

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

    const onSearch = (value) => {
        findProjectPage({ projectName: value })
    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }

        findProjectPage(values);

    }
    return <Provider {...store}>
        <Row className="projectset-project">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="projectSetDetail">
                    <Breadcumb firstText="项目">
                        <PrivilegeProjectButton code={'RelationProject'} domainId={projectSetId}  {...props}>
                            <ProjectSetRelevance projectSetId={projectSetId}>关联项目</ProjectSetRelevance>
                        </PrivilegeProjectButton>

                    </Breadcumb>
                    <div>
                        <div className="search-add">
                            <div>
                                {/* <Select defaultValue="项目集列表" style={{ width: 120 }} onChange={(value) => changeProjectSet(value)}>
                                {
                                    projectSetAllList && projectSetAllList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select> */}
                                <InputSearch
                                    placeholder="搜索项目"
                                    allowClear
                                    style={{ width: 190 }}
                                    onChange={onSearch}
                                />
                            </div>
                        </div>

                        <div className="projectSet-table-box">
                            <Table
                                columns={columns}
                                dataSource={projectRelevance}
                                rowKey={record => record.id}
                                pagination={{
                                    total: total,
                                    pageSize: projectPageParams.pageParam.pageSize,
                                    current: projectPageParams.pageParam.currentPage,
                                    onChange: changePage,
                                    position: ["bottomCenter"],
                                    showTotal: () => `共${total}条`
                                }}
                                scroll={{
                                    x: "100%"
                                }}
                            />
                        </div>
                    </div>

                </div>
            </Col>
        </Row>
    </Provider>

}

export default withRouter(observer(ProjectSetProjectList));