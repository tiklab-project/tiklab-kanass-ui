/*
 * @Descripttion: 项目集的项目列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:49:14
 */
import React, { useEffect, useState } from 'react';
import {Table, Space, Select, Row, Col, Tooltip, Progress, Empty} from 'antd';
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
import Button from "../../../common/button/Button";
import ProjectAdd from "../../../project/project/components/ProjectAdd";
import { getUser } from 'tiklab-core-ui';

const ProjectSetProjectList = (props) => {
    const store = {
        projectSetProjectStore: ProjectSetProjectStore
    }
    const { findProjectCount, findProjectPage, updateProject, projectRelevance, total, projectPageParams } = ProjectSetProjectStore;

    const [projectSetId, setProjectSetId] = useState(props.match.params.projectSetId);
    useEffect(() => {
        findPage({ projectSetId: projectSetId })
        return;
    }, [projectSetId])
    const [projectAddVisible, setProjectAddVisible] = useState(false)
    const [activeTabs, setActiveTabs] = useState("1");
    const [projectCount,  setProjectCount] = useState({
        total: 0,
        myCreated: 0,
        myFocus: 0,
    });
    const userId = getUser().userId;

    const findPage = (values) => {
        findProjectPage(values);
        findProjectCount().then(res => {
            if (res.code === 0){
                setProjectCount(res.data)
            }
        })
    }

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
                findPage({projectSetId: projectSetId})
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
                    <div >{text === 'IPD项目' ? text.substring(0,3) : text.substring(0,2)}</div>
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
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "15%",
            render: (text, record) => (
                <>
                    {text}
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
        switch (activeTabs) {
            case "1":
                findPage({ focusUser: null, creator: null, projectName: value });
                break;
            case "3":
                findPage({ focusUser: userId, creator: null, projectName: value });
                break;
            case "4":
                findPage({ focusUser: null, creator: userId, projectName: value });
                break
        }
    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }

        findPage(values);

    }

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findPage({ focusUser: null, creator: null, projectName: null })
                break;
            case "3":
                findPage({ focusUser: userId, creator: null, projectName: null })
                break;
            case "4":
                findPage({ focusUser: null, creator: userId, projectName: null });
                break
            default:
                break;
        }
    }

    const projectTab = [
        {
            title: '所有',
            key: '1',
            icon: "project",
            value: "total",
        },
        // {
        //     title: '我收藏的',
        //     key: '3',
        //     icon: "programconcern",
        //     value: "myFocus",
        // },
        {
            title: '我创建的',
            key: '4',
            icon: "programbuild",
            value: "myCreated",
        }
    ]


    return <Provider {...store}>
        <Row className="projectset-project">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="projectSetDetail">
                    <Breadcumb firstText="项目">
                        <div className={"project-operate-button"}>
                            {/*<PrivilegeProjectButton code={'RelationProject'} domainId={projectSetId}  {...props}>*/}
                                <ProjectSetRelevance projectSetId={projectSetId}>关联项目</ProjectSetRelevance>
                            {/*</PrivilegeProjectButton>*/}
                            <Button
                                style={{ width: "fit-content" }}
                                onClick={() => {setProjectAddVisible(true)}} buttonText={"创建项目"} >
                            </Button>
                        </div>

                    </Breadcumb>
                    <div>
                        <div className="search-add">
                            <div className={"project-filter"}>
                                {/* <Select defaultValue="项目集列表" style={{ width: 120 }} onChange={(value) => changeProjectSet(value)}>
                                {
                                    projectSetAllList && projectSetAllList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select> */}
                                <div className="project-tabs">
                                    {
                                        projectTab.map(item => {
                                            return <div
                                                className={`project-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                                key={item.key}
                                                onClick={() => selectTabs(item.key)}
                                            >
                                                {item.title}<span className="tabs-bar-num">{projectCount[item.value]}</span>
                                            </div>
                                        })
                                    }
                                </div>
                                <div className="project-search">
                                    <InputSearch
                                        placeholder="搜索项目"
                                        allowClear
                                        style={{ width: 190 }}
                                        onChange={onSearch}
                                    />
                                </div>
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
                                locale={{
                                    emptyText: <Empty
                                        imageStyle={{height: 100}}
                                        description={<span>暂无数据</span>}
                                    />
                                }}
                            />
                        </div>
                    </div>
                    <ProjectAdd
                        projectAddVisible  = {projectAddVisible}
                        setProjectAddVisible = {setProjectAddVisible}
                        projectSetId = {projectSetId}
                    />
                </div>
            </Col>
        </Row>
    </Provider>

}

export default withRouter(observer(ProjectSetProjectList));