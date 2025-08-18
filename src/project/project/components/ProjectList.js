/*
 * @Descripttion: 项目列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-08 11:02:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:06:27
 */
import React, {Fragment, useEffect, useRef} from "react";
import { Spin, Table, Space,Tooltip, Select, Empty, Progress } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getUser } from 'tiklab-core-ui';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { useState } from "react";
import UserIcon from "../../../common/UserIcon/UserIcon";
import InputSearch from "../../../common/input/InputSearch";
import Button from "../../../common/button/Button";
import "./projectList.scss";
import { useDebounce } from "../../../common/utils/debounce";
import ProjectFilterQuick from "./ProjectFilterQuick";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import { PrivilegeButton } from "tiklab-privilege-ui";
import CircleProgress from "../../../common/progress/CircleProgress";
import ProjectAdd from "./ProjectAdd";
import ProjectOperateSelectModal from "./ProjectOperateSelectModal";
import ColorIcon from "../../../common/colorIcon/ColorIcon";

const ProjectList = (props) => {
    const { projectStore } = props;
    const { projectList, findProjectSortRecentTime, createRecent, findJoinProjectList, createProjectFocus, findProjectFocusList,
        deleteProjectFocusByQuery, activeTabs, setActiveTabs, findProjectCount, findProjectPage, total, projectPageParams
    } = projectStore;

    const userId = getUser().userId;
    const [focusProjectList, setFocusProjectList] = useState([])
    const [recentProjectList, setRecentProjectList] = useState()
    const [recentLoading, setRecentLoading] = useState(true);
    const [projectCount,  setProjectCount] = useState({
        total: 0,
        myCreated: 0,
        myFocus: 0,
    });

    const [projectAddVisible, setProjectAddVisible] = useState(false);
    const projectListRef = useRef();

    useEffect(() => {
        setActiveTabs("1")
        findProjectPage({ focusUser: null, creator: null, projectName: null })
        setRecentLoading(true)
        findProjectSortRecentTime({}).then(res => {
            setRecentProjectList(res.data)
            setRecentLoading(false)
        })
        findProjectCount().then(res => {
            if (res.code === 0){
                setProjectCount(res.data)
            }
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
            title: '所有',
            key: '1',
            icon: "project",
            value: "total",
        },
        {
            title: '我收藏的',
            key: '3',
            icon: "programconcern",
            value: "myFocus",
        },
        {
            title: '我创建的',
            key: '4',
            icon: "programbuild",
            value: "myCreated",
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

        props.history.push({ pathname: `/project/${project.id}/workitem` })

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
        props.history.push({ pathname: `/project/${project.id}/set/basicInfo` })
    }
    const onSearch = useDebounce(value => {
        switch (activeTabs) {
            case "1":
                findProjectPage({
                    focusUser: null,
                    creator: null,
                    projectName: value,
                    pageParam: {
                        pageSize: projectPageParams.pageParam.pageSize,
                        currentPage: 1,
                    }
                })
                break;
            case "3":
                findProjectPage({
                    focusUser: userId,
                    creator: null,
                    projectName: value,
                    pageParam: {
                        pageSize: projectPageParams.pageParam.pageSize,
                        currentPage: 1,
                    } })
                break;
            case "4":
                findProjectPage({
                    focusUser: null,
                    creator: userId,
                    projectName: value,
                    pageParam: {
                        pageSize: projectPageParams.pageParam.pageSize,
                        currentPage: 1,
                    } });
                break
            default:
                break;
        }
        findProjectCount().then(res => {
            setProjectCount(res.data)
        })
    }, [500]);



    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findProjectPage({ focusUser: null, creator: null, projectName: null })
                break;
            case "3":
                findProjectPage({ focusUser: userId, creator: null, projectName: null })
                break;
            case "4":
                findProjectPage({ focusUser: null, creator: userId, projectName: null });
                break
            default:
                break;
        }
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
            width: "25%",
            ellipsis: true,
            render: (text, record) =>
                <div className="project-name" onClick={() => goProdetail(record)} >
                    <div className="project-icon">
                        <ColorIcon color={record.color} name={record.projectName} className="icon-32" />
                    </div>
                    <div className="project-name-content">
                        <Tooltip title={text}>
                            <div className="project-text">{text}</div>
                        </Tooltip>
                    </div>

                </div>
        },
        {
            title: "项目类型",
            dataIndex: ["projectType", "name"],
            key: "projectType",
            align: "left",
            width: "8%",
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
            dataIndex: "percent",
            key: "percent",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <CircleProgress
                    percent={text}
                />
            )
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            width: "10%",
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
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            width: "10%",
            render: (text, record) =>
                <div style={{ display: "flex", gap: "15px" }}>
                    {
                        focusProjectList.indexOf(record.id) !== -1 ?
                            <svg className="operate-icon" aria-hidden="true" onClick={() => deleteFocusProject(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="operate-icon" aria-hidden="true" onClick={() => addFocusProject(record.id)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    {/*<svg className="operate-icon" aria-hidden="true" onClick={() => goToProjectSet(record)}>*/}
                    {/*    <use xlinkHref="#icon-more-default"></use>*/}
                    {/*</svg>*/}
                    <ProjectOperateSelectModal
                        projectInfo={record}
                        projectStore={projectStore}
                        getPopupContainer={projectListRef}
                    />
                </div>
        }
    ];
    const setWorkNum = (num) => {
        let showNum;
        const isMax = Math.floor(num / 1000);
        if (isMax >= 1) {
            showNum = `${isMax}k+`
        } else {
            showNum = num;
        }
        return showNum;
    }
    return (
        <Fragment>
            <Breadcumb
                firstText="项目"
            >
                <PrivilegeButton code={'ProjectAdd'}  {...props}>
                    <Button type="primary" onClick={() => {setProjectAddVisible(true)}} buttonText={"添加项目"} />
                </PrivilegeButton>

            </Breadcumb>
            <div className="project-recent-box">
                <div className="project-recent-box-title">
                    常用项目
                </div>
                <Spin spinning={recentLoading} tip="加载中..." >
                    <div className="home-project">
                        {
                            recentProjectList && recentProjectList.length > 0 ? recentProjectList.map((item, index) => {

                                return <div className="project-item" key={item.id} onClick={() => goProdetail(item)}>
                                    <div className="item-title">
                                        <ColorIcon color={item.color} name={item.projectName} className="icon-32" />
                                        <Tooltip title={item.projectName}>
                                        <span className="item-name">{item.projectName}</span>
                                        </Tooltip>
                                    </div>
                                    <div className="item-work">
                                        <div className="process-work">
                                            <span className="work-label" style={{ color: "#999" }}>
                                                待办事项
                                            </span>
                                            <span>
                                                {setWorkNum(item.processWorkItemNumber)}
                                            </span>
                                        </div>
                                        <div className="end-work">
                                            <span className="work-label" style={{ color: "#999" }}>
                                                已完成事项
                                            </span>
                                            <span>
                                                {setWorkNum(item.endWorkItemNumber)}
                                            </span>
                                        </div>

                                    </div>
                                </div>


                            })
                                :
                                <>
                                    {
                                        !recentLoading && <ProjectEmpty description="暂时没有点击过项目~" />
                                    }
                                </>

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
                                    {item.title}<span className="tabs-bar-num">{projectCount[item.value]}</span>
                                </div>
                            })
                        }
                    </div>
                    <div className="project-search">
                        <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索项目"} />
                        <ProjectFilterQuick />
                    </div>
                </div>
            </div>

            <div className="project-table-box" ref={projectListRef}>
                <Table
                    columns={columns}
                    dataSource={projectList}
                    rowKey={record => record.id}
                    // onChange={handleTableChange}
                    pagination={{
                        total: total,
                        pageSize: projectPageParams.pageParam.pageSize,
                        current: projectPageParams.pageParam.currentPage,
                        onChange: changePage,
                        position: ["bottomCenter"],
                        showTotal: () => `共${total}条`
                    }}
                    bordered={false}
                    scroll={{
                        x: "100%"
                    }}
                />
            </div>
            <ProjectAdd
                projectAddVisible  = {projectAddVisible}
                setProjectAddVisible = {setProjectAddVisible}
            />
        </Fragment>
    )
}
export default inject('projectStore')(withRouter(observer(ProjectList)));