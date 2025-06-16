/*
 * @Descripttion: 项目集列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:05:47
 */
import React, { useEffect, useState, Fragment } from 'react';
import {Table, Space, Row, Col, Empty, Spin, Progress} from 'antd';
import "./ProjectSet.scss";
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import { getUser } from 'tiklab-core-ui';
import Button from "../../../common/button/Button";
import ColorIcon from '../../../common/colorIcon/colorIcon';
import ProjectEmpty from '../../../common/component/ProjectEmpty';
import { PrivilegeButton } from 'tiklab-privilege-ui';
import CircleProgress from "../../../common/progress/CircleProgress";

const ProjectSetTable = (props) => {
    const { projectSetStore, } = props;
    const { getProjectSetlist, projectSetList, getUseList, findProjectSetFocusList,
        deleteProjectSetFocusByQuery, createProjectSetFocus, findRecentProjectSetList,
        findFocusProjectSetList, findJoinProjectSetList, createRecent, findProjectSetCount, projectSetPageParams, total,
        findProjectSetPage
    } = projectSetStore;

    const [name, setName] = useState("添加项目集")
    const [recentLoading, setRecentLoading] = useState(true);
    const [activeTabs, setActiveTabs] = useState("1")
    const [focusProjectSetList, setFocusProjectSetList] = useState([])
    const [recentProjectSetList, setRecentProjectSetList] = useState([])
    const [projectSetCount, setProjectSetCount] = useState({
        total: 0,
        myFocus: 0,
        myCreated: 0
    })
    const [loading, setLoading] = useState(false);
    const userId = getUser().userId;
    const status = [
        "未开始",
        "进行中",
        "已结束",
    ]

    useEffect(() => {
        // findRecentProjectSetList({})
        setRecentLoading(true)
        findRecentProjectSetList({}).then(res => {
            if (res.code === 0) {
                setRecentProjectSetList(res.data)
                setRecentLoading(false)
            }
        })
        findProjectSetCount({ name:null }).then(res => {
            if (res.code === 0){
                setProjectSetCount(res.data)
            }
        })
        findProjectSetFocus(userId)
        getUseList()
        return;
    }, [])

    /**
     * 查找关注的项目集
     * @param {项目集id} id 
     */
    const findProjectSetFocus = (id) => {
        findProjectSetFocusList({ masterId: id }).then(res => {
            if (res.code === 0) {
                const focusList = res.data;
                focusList.map(item => {
                    focusProjectSetList.push(item.projectSetId)
                })
                setFocusProjectSetList(focusProjectSetList)
            }
        })
    }


    const goProjectSetDetail = (record) => {
        const params = {
            name: record.name,
            model: "projectSet",
            modelId: record.id
        }
        createRecent(params)
        localStorage.setItem("projectSet", JSON.stringify(record))
        props.history.push(`/projectSet/${record.id}/overview`)
    }

    const goToProjectSetSet = (record) => {
        localStorage.setItem("projectSet", JSON.stringify(record))
        props.history.push(`/projectSet/${record.id}/set/basicInfo`)
    }

    const onSearch = (value) => {
        setLoading(true)
        findProjectSetPage({
            name: value,
            pageParam: {
                pageSize: 5,
                currentPage: 1
            }
        }).then(res => {
            setLoading(false)
        })
        findProjectSetCount({ name: value }).then(res => {
            if (res.code === 0){
                setProjectSetCount(res.data)
            }
        })
    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }
        setLoading(true)
        findProjectSetPage(values).then(res => {
            setLoading(false);
        })
    }

    const pageDowm = (pagination) => {
        getProjectSetlist({ current: pagination.current })
    }

    const addFocusProjectSet = (id) => {
        createProjectSetFocus({ projectSetId: id }).then(res => {
            if (res.code === 0) {
                focusProjectSetList.push(id)
                setFocusProjectSetList([...focusProjectSetList])
            }
        })
    }
    const deleteFocusProjectSet = (id) => {
        const params = {
            masterId: userId,
            projectSetId: id
        }
        deleteProjectSetFocusByQuery(params).then(res => {
            if (res.code === 0) {
                const index = focusProjectSetList.indexOf(id);
                if (index > -1) {
                    focusProjectSetList.splice(index, 1);
                }
                setFocusProjectSetList([...focusProjectSetList])
            }
        })
    }

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "30%",
            render: (text, record) => <Space onClick={() => goProjectSetDetail(record)} className="span-botton">
                <ColorIcon color={record.color} name={record.name} className="projectSet-table-icon" />
                {text}
            </Space>,
        },

        {
            title: "计划时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <>
                {record.startTime} - {record.endTime}
            </>
        },
        {
            title: "关联项目",
            dataIndex: "projectNumber",
            key: "projectNumber",
            align: "left",
            width: "10%",
            render: (text, record) => <span>
                {text > 0 ? text : 0}
            </span>
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            width: "15%"

        },
        {
            title: "项目状态",
            dataIndex: "status",
            key: "status",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <div className={`project-status project-status${text === "1" ? "-todo" : text === "2" ? "-process" : "-done"}`}>{status[text]}</div>
            )
        },
        {
            title: "进度",
            dataIndex: "progress",
            key: "progress",
            align: "left",
            render: (text, record) => (
                <>
                    <CircleProgress
                        percent={text}
                    />
                </>
            )
        },
        {
            title: "操作",
            align: "left",
            width: "10%",
            render: (text, record) =>
                <div style={{ display: "flex", gap: "15px" }}>
                    {
                        focusProjectSetList.indexOf(record.id) !== -1 ?
                            <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => deleteFocusProjectSet(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => addFocusProjectSet(record.id)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => goToProjectSetSet(record)}>
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                </div>
        }
    ]

    const projectTab = [
        {
            title: '所有',
            key: '1',
            icon: "project",
            value: "total"
        },
        {
            title: '我收藏的',
            key: '3',
            icon: "projectSetfocus",
            value: "myFocus"
        },
        {
            title: '我创建的',
            key: '4',
            icon: "projectSetcreated",
            value: "myCreated"
        }
    ]

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findProjectSetPage({ focusMasterId: null, creator: null, projectName: null })
                break;
            case "3":
                findProjectSetPage({ focusMasterId: userId, creator: null, projectName: null })
                break;
            case "4":
                findProjectSetPage({ focusMasterId: null, creator: userId, projectName: null });
                break
            default:
                break;
        }
    }



    return <div className="projectSet-list">
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <Breadcumb firstText="项目集">
                    <PrivilegeButton code={'ProjectSetAdd'}  {...props}>
                        <Button
                            style={{ width: "fit-content" }}
                            type="primary" onClick={() => props.history.push("/projectSetAdd")} buttonText={name} >
                        </Button>
                    </PrivilegeButton>

                </Breadcumb>
                <div className="projectSet-recent-box">
                    <div className="projectSet-recent-box-title">
                        常用项目集
                    </div>
                    <Spin spinning={recentLoading} tip="加载中..." >
                        <div className="recent-projectSet">
                            {
                                recentProjectSetList && recentProjectSetList.length > 0 ? recentProjectSetList.map((item, index) => {

                                    return <div className="projectSet-item" key={item.id} onClick={() => goProjectSetDetail(item)}>
                                        <div className="item-title">
                                            <ColorIcon color={item.color} name={item.name} className="item-icon" />
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                        <div className="item-info">
                                            <div className="info-master">
                                                <span className="info-label" style={{ color: "#999" }}>
                                                    负责人
                                                </span>
                                                <span className="info-value">
                                                    {item.master?.nickname}
                                                </span>
                                            </div>
                                            <div className="info-project">
                                                <span className="info-label" style={{ color: "#999" }}>
                                                    关联项目
                                                </span>
                                                <span className="info-value">
                                                    {item.projectNumber}
                                                </span>
                                            </div>

                                        </div>
                                    </div>


                                })
                                    :
                                    <>
                                        {
                                            !recentLoading && <ProjectEmpty description="暂时没有点击过项目集~" />
                                        }
                                    </>

                            }
                        </div>

                    </Spin>

                </div>
                <div className="projectSet-search-tab">
                    <div className="projectSet-tabs">
                        {
                            projectTab.map(item => {
                                return <div
                                    className={`projectSet-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                    key={item.key}
                                    onClick={() => selectTabs(item.key)}
                                >
                                    {item.title}<span className="tabs-bar-num">{projectSetCount[item.value]}</span>
                                </div>
                            })
                        }
                    </div>
                    <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索项目集"} />
                </div>
                <div>
                    <div className="projectSet-table-box">
                        <Spin spinning={loading} tip="加载中">
                            <Table
                                columns={columns}
                                dataSource={projectSetList}
                                rowKey={record => record.id}
                                pagination={{
                                    total: total,
                                    pageSize: projectSetPageParams.pageParam.pageSize,
                                    current: projectSetPageParams.pageParam.currentPage,
                                    onChange: changePage,
                                    position: ["bottomCenter"],
                                    showTotal: () => `共${total}条`
                                }}
                                onChange={pageDowm}
                                className="projectSet-table-item"
                                scroll={{
                                    x: "100%"
                                }}

                            />
                        </Spin>
                    </div>

                </div>
            </Col>
        </Row>
    </div>
}

export default withRouter(inject('projectSetStore')(observer(ProjectSetTable)));