import React, { Fragment, useEffect } from "react";
import { Spin, Table, Space, Select, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getUser } from 'tiklab-core-ui';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { useState } from "react";
import UserIcon from "../../../common/UserIcon/UserIcon";
import InputSearch from "../../../common/input/InputSearch";
import Button from "../../../common/button/Button";
import setImageUrl from "../../../common/utils/setImageUrl";
const { Option } = Select;

const ProjectList = (props) => {
    const { projectStore } = props;
    const { findProjectList, prolist, findProjectSortRecentTime, createRecent, findRecentProjectList,
        findJoinProjectList, createProjectFocus, findProjectFocusList,
        deleteProjectFocusByQuery, findFocusProjectList, activeTabs, setActiveTabs
    } = projectStore;

    const userId = getUser().userId;
    const [focusProjectList, setFocusProjectList] = useState([])
    const [recentProjectList, setRecentProjectList] = useState()
    const [recentLoading, setRecentLoading] = useState(false);
    const tenant = getUser().tenant;

    useEffect(() => {
        findJoinProjectList({})
        setRecentLoading(true)
        findProjectSortRecentTime({}).then(res => {
            setRecentProjectList(res.data.splice(0, 4))
            setRecentLoading(false)
        })
        findProjectFocus(userId)
        return;
    }, [])

    const status = {
        1: "未开始",
        2: "进行中",
        3: "已结束",
    }

    const projectTab = [
        {
            title: '所有项目',
            key: '1',
            icon: "project"
        },
        // {
        //     title: '我最近浏览的',
        //     key: '2',
        //     icon: "programrencent"
        // },
        {
            title: '我收藏的',
            key: '3',
            icon: "programconcern"
        },
        {
            title: '我创建的',
            key: '4',
            icon: "programbuild"
        }
    ]


    const goProdetail = (project) => {
        // localStorage.setItem("projectId", project.id);
        localStorage.setItem("project", JSON.stringify(project));
        const params = {
            name: project.projectName,
            model: "project",
            modelId: project.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: project.iconUrl
        }
        createRecent(params)

        props.history.push({ pathname: `/index/projectDetail/${project.id}/work/table` })

    };

    const goToProjectSet = (project) => {
        const params = {
            name: project.projectName,
            model: "project",
            modelId: project.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
        }
        createRecent(params)
        props.history.push({ pathname: `/index/projectDetail/${project.id}/projectSetDetail/basicInfo` })
    }
    const onSearch = value => {
        console.log(value)
        switch (activeTabs) {
            case "1":
                findJoinProjectList({ projectName: value, creator: null })
                break;
            case "2":
                findRecentProjectList({ projectName: value })
                break;
            case "3":
                findProjectList({ master: userId, projectName: value })
                break;
            case "4":
                findJoinProjectList({ creator: userId, projectName: value });
                break
            default:
                break;
        }
    };

    const handleTableChange = (pagination) => {
        findProjectList({ current: pagination.current })
    };

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findJoinProjectList({ creator: null })
                break;
            case "2":
                findRecentProjectList()
                break;
            case "3":
                findFocusProjectList({ master: userId })
                break;
            case "4":
                findProjectList({ creator: userId });
                break
            default:
                break;
        }
    }

    const addFocusProject = (id) => {
        createProjectFocus({ projectId: id }).then(res => {
            if (res.code === 0) {
                focusProjectList.push(id)
                setFocusProjectList([...focusProjectList])
            }
        })
    }
    const deleteFocusProject = (id) => {
        const params = {
            masterId: userId,
            projectId: id
        }
        deleteProjectFocusByQuery(params).then(res => {
            if (res.code === 0) {
                const index = focusProjectList.indexOf(id);
                if (index > -1) {
                    focusProjectList.splice(index, 1);
                }
                setFocusProjectList([...focusProjectList])
            }
        })
    }

    const findProjectFocus = (id) => {
        findProjectFocusList({ masterId: id }).then(res => {
            if (res.code === 0) {
                const focusList = res.data;
                focusList.map(item => {
                    focusProjectList.push(item.projectId)
                })
                setFocusProjectList(focusProjectList)
            }
        })
    }

    const columns = [
        {
            title: "项目名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            render: (text, record) =>
                <div className="project-name" onClick={() => goProdetail(record)} >
                    <div className="project-icon">
                        {
                            record.iconUrl ?
                                <img
                                    alt=""
                                    className="icon-32"
                                    src = {setImageUrl(record.iconUrl)}
                                />
                                :
                                <img
                                    src={('/images/project1.png')}
                                    alt=""
                                    className="icon-32"
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
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
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
            width: "20%",
            render: (text, record) => (
                <>
                    {record.startTime} - {record.endTime}
                </>
            )
        },
        {
            title: "项目状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "left",
            render: (text, record) => (
                <div className="project-status">{status[text]}</div>
            )
        },
        {
            title: "操作",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            width: "100px",
            render: (text, record) =>
                <div style={{ display: "flex", gap: "15px" }}>
                    {
                        focusProjectList.indexOf(record.id) !== -1 ?
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusProject(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusProject(record.id)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <svg className="svg-icon" aria-hidden="true" onClick={() => goToProjectSet(record)}>
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                </div>
        }
    ];

    return (
        <Fragment>
            <Breadcumb
                firstText="项目"
            >
                <Button type="primary" onClick={() => props.history.push("/index/projectAdd")} buttonText={"添加项目"} />
            </Breadcumb>
            <div className="project-recent-box">
                <div className="title">
                    <div>
                        最近项目
                    </div>
                </div>
                <Spin spinning={recentLoading} delay={500} >
                    <div className="home-project">
                        {
                            recentProjectList && recentProjectList.length > 0 ? recentProjectList.map((item, index) => {

                                    return <div className="project-item" key={item.id} onClick={() => goProdetail(item)}>
                                        <div className="item-title">
                                            {
                                                item.iconUrl ?
                                                    <img
                                                        alt=""
                                                        className="icon-32"
                                                        src = {setImageUrl(item.iconUrl)}
                                                    />
                                                    :
                                                    <img
                                                        src={('/images/project1.png')}
                                                        alt=""
                                                        className="icon-32"
                                                    />

                                            }
                                            <span>{item.projectName}</span>
                                        </div>
                                        <div className="item-work">
                                            <div className="process-work"><span style={{ color: "#999" }}>未处理的事务</span><span>{item.processWorkItemCount}</span></div>
                                            <div className="end-work"><span style={{ color: "#999" }}>已处理事务</span><span>{item.endWorkItemCount}</span></div>
                                        </div>

                                    </div>
                                })
                            
                            :
                            <Empty image="/images/nodata.png" description="暂时没有查看过项目~" />
                        }
                    </div>
                </Spin>
            </div>
            <div className="project-tabs-search">
                <div className="project-filter">
                    <div className="project-tabs">
                        {
                            projectTab.map(item => {
                                return <div
                                    className={`project-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                    key={item.key}
                                    onClick={() => selectTabs(item.key)}
                                >
                                    {item.title}
                                </div>
                            })
                        }
                    </div>
                    <InputSearch onChange={(value) => onSearch(value)} placeholder={"项目名称"} />
                </div>
            </div>

            <div className="project-table-box">
                <Table
                    columns={columns}
                    dataSource={prolist}
                    rowKey={record => record.id}
                    onChange={handleTableChange}
                    pagination={false}
                    bordered={false}
                />
            </div>
        </Fragment>
    )
}
export default inject('projectStore')(withRouter(observer(ProjectList)));