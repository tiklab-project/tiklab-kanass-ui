/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:35:43
 */
import React, { useEffect, useState, Fragment } from 'react';
import { Table, Space, Row, Col } from 'antd';
import "./ProjectSet.scss";
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import { getUser } from 'tiklab-core-ui';
import Button from "../../../common/button/Button";

const ProjectSetTable = (props) => {
    const { projectSetStore, } = props;
    const { getProjectSetlist, projectSetList, getUseList, findProjectSetFocusList,
        deleteProjectSetFocusByQuery, createProjectSetFocus, findRecentProjectSetList,
        findFocusProjectSetList, findAllProjectSet, createRecent } = projectSetStore;

    const [name, setName] = useState("添加项目集")

    const [activeTabs, setActiveTabs] = useState("2")
    const [focusProjectSetList, setFocusProjectSetList] = useState([])
    const userId = getUser().userId;

    useEffect(() => {
        // findAllProjectSet()
        findRecentProjectSetList({})
        // findProjectSetFocus()
        getUseList()
        return;
    }, [])


    const goProjectSetDetail = (record) => {
        const params = {
            name: record.name,
            model: "projectSet",
            modelId: record.id
        }
        createRecent(params)

        localStorage.setItem("projectSet", JSON.stringify(record))
        props.history.push(`/index/projectSetdetail/${record.id}/survey`)
    }

    const goToProjectSetSet = (record) => {
        localStorage.setItem("projectSet", JSON.stringify(record))
        props.history.push(`/index/projectSetdetail/${record.id}/projectSetset/basicInfo`)
    }

    const onSearch = (value) => {
        getProjectSetlist({ name: value })
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
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-program"></use>
                </svg>
                {text}
            </Space>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",

        },
        {
            title: "计划时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "20%",
            render: (text, record) => <>
                {record.startTime} - {record.endTime}
            </>
        },
        {
            title: "关联项目",
            dataIndex: "projectNumber",
            key: "projectNumber",
            align: "left",
            width: "20%",
            render: (text, record) => <span>
                {text > 0 ? text : 0}
            </span>
        },
        {
            title: "操作",
            align: "left",
            width: "60px",
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
            title: '所有项目集',
            key: '1',
            icon: "project"
        },
        {
            title: '我最近浏览的',
            key: '2',
            icon: "projectSetrencent"
        },
        {
            title: '我收藏的',
            key: '3',
            icon: "projectSetfocus"
        },
        {
            title: '我创建的',
            key: '4',
            icon: "projectSetcreated"
        }
    ]

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findAllProjectSet()
                break;
            case "2":
                findRecentProjectSetList({})
                break;
            case "3":
                findFocusProjectSetList({ master: userId })
                break;
            case "4":
                getProjectSetlist({ master: userId });
                break
            default:
                break;
        }
    }

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

    return <div className="projectSet-list">
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <Breadcumb firstText="项目集">
                    <Button
                        style={{ width: "fit-content" }}
                        type="primary" onClick={() => props.history.push("/index/projectSetAdd")} buttonText={name} >
                    </Button>
                </Breadcumb>

                <div className="projectSet-search-tab">
                    {/* <div className="projectSet-filter"> */}
                        <div className="projectSet-tabs">
                            {
                                projectTab.map(item => {
                                    return <div
                                        className={`projectSet-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                        key={item.key}
                                        onClick={() => selectTabs(item.key)}
                                    >
                                        {item.title}
                                    </div>
                                })
                            }
                        </div>
                        <InputSearch onChange={(value) => onSearch(value)} placeholder={"项目集名称"} />
                        {/* <span className="projectSet-num">{projectSetList && projectSetList.length}个项目集</span> */}
                    {/* </div> */}
                </div>
                <div>
                    <div className="table-box">
                        <Table
                            columns={columns}
                            dataSource={projectSetList}
                            rowKey={record => record.id}
                            pagination={false}
                            onChange={pageDowm}
                        />
                    </div>

                </div>
            </Col>
        </Row>
    </div>
}

export default withRouter(inject('projectSetStore')(observer(ProjectSetTable)));