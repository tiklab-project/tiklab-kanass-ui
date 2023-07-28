import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Row, Col, Spin } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkTable.scss";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkBreadCrumb from "./WorkBreadCrumb";
import WorkTableFilter from "./WorkTableFilter";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
const WorkTableContent = (props) => {
    const { workStore, form } = props
    const { workList, total, searchCondition, getWorkConditionPageTree, tableLoading,
        detWork, workShowType, getWorkConditionPage, viewType, setWorkId, setDetailCrumbArray,
        setWorkIndex, createRecent } = workStore;
    const tenant = getUser().tenant;
    const sprintId = props.match?.params?.sprint;
    const goProdetail = (record, index) => {
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            project: { id: record.project.id },
            projectType: { id: record.project.projectType.id },
            iconUrl: record.workTypeSys.iconUrl
        }
        createRecent(params)

        setWorkId(record.id)
        setWorkIndex(index + 1)
        setDetailCrumbArray([{ id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl }])
        console.log(props)
        if (props.route.path === "/index/work") {
            props.history.push(`/index/workDetail/${record.id}`)

        }
        if (props.route.path === "/index/projectDetail/:id/work") {
            props.history.push(`/index/projectDetail/${record.project.id}/workDetail/${record.id}`)
        }
        if (props.route.path === "/index/:id/sprintdetail/:sprint/workItem") {
            props.history.push(`/index/${record.project.id}/sprintdetail/${sprintId}/workDetail/${record.id}`)
        }
        // setIsWorkList(false)

    }

    const columns = [
        {
            title: '事项',
            dataIndex: 'title',
            key: 'title',
            className: "work-first-col",
            render: (text, record, index) => <div className="work-name" onClick={() => goProdetail(record, index)} >
                <div className="work-icon">
                    {
                        record.workTypeSys.iconUrl ?
                            <img
                            src={ version === "cloud" ? 
                            (upload_url + record.workTypeSys?.iconUrl + "?tenant=" + tenant)
                            :
                            (upload_url + record.workTypeSys?.iconUrl)
                        }
                                alt=""
                                className="list-img"

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="list-img"
                            />
                    }
                </div>
                <div>
                    <div className="work-key">{record.id}</div>
                    <div className="work-text">{text}</div>
                </div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '项目',
            dataIndex: ['project', 'projectName'],
            key: 'project',
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    {
                        record.project.iconUrl ? <img
                            src={(upload_url + record.project.iconUrl)}
                            alt=""
                            className="img-icon"
                        />
                            :
                            <img
                                src={'/images/project3.png'}
                                alt=""
                                className="img-icon"
                            />
                    }

                </div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    {
                        record.workPriority?.iconUrl ? <img
                            src={'/images/' + record.workPriority?.iconUrl}
                            alt=""
                            className="img-icon"
                        />
                            :
                            <img
                                src={'/images/proivilege1.png'}
                                alt=""
                                className="img-icon"
                            />
                    }

                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            render: (text, record) => <span className="work-status">
                {text}
            </span>
        },
        {
            title: '操作',
            width: "150",
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <svg className="svg-icon" aria-hidden="true" onClick={() => goProdetail(record)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <svg className="svg-icon" aria-hidden="true" onClick={() => deleteWork(record.id)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-more"></use>
                    </svg>
                </Space>
            ),
        }
    ];


    // 改变页数
    const changePage = (page) => {
        const values = {
            pageParam: {
                pageSize: 20,
                currentPage: page,
            }
        }
        if (viewType === "tree") {
            getWorkConditionPageTree(values)
        }
        if (viewType === "tile") {
            getWorkConditionPage(values)
        }
    }

    // 删除事项
    const deleteWork = (id) => {
        detWork(id).then(() => {
            if (viewType === "tree") {
                getWorkConditionPageTree()
            }
            if (viewType === "tile") {
                getWorkConditionPage()
            }
        })
    }

    const sorter = (pagination, filters, sorter, extra) => {
        console.log(filters, sorter)
        const sortParams = []
        const sorterArr = Array.isArray(sorter) ? sorter : [sorter];
        sorterArr.map(item => {
            if (item.order === "ascend") {
                sortParams.push({
                    name: item.columnKey,
                    orderType: "asc"
                })
            }
            if (item.order === "descend") {
                sortParams.push({
                    name: item.columnKey,
                    orderType: "desc"
                })
            }
            return sortParams;
        })
        searchCondition.orderParams = sortParams;
        if (workShowType === "tableTree") {
            getWorkConditionPageTree()
        }
        if (workShowType === "tableTile") {
            getWorkConditionPage()
        }

    }

    return (

        <Row style={{ height: "100%", overflow: "auto" }}>
            <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                <>
                    <div className="work-list-col">
                        <WorkBreadCrumb />
                        <WorkTableFilter form={form} />
                    </div>
                    <div style={{ overflow: "hidden" }} className="work-table">
                        <Spin spinning={tableLoading} delay={500} >
                            <Table
                                columns={columns}
                                dataSource={workList}
                                rowKey={(record) => record.id}
                                // onChange={sorter}
                                pagination={{
                                    total: total,
                                    pageSize: 20,
                                    current: searchCondition.pageParam.currentPage,
                                    onChange: changePage,
                                    position: ["bottomCenter"]
                                }}
                                expandable={{
                                    expandIcon: ({ expanded, onExpand, record }) => (
                                        record.children && record.children.length > 0 ? expanded ?
                                            <svg className="svg-icon" aria-hidden="true" onClick={e => onExpand(record, e)}>
                                                <use xlinkHref="#icon-workDown"></use>
                                            </svg> :
                                            <svg className="svg-icon" aria-hidden="true" onClick={e => onExpand(record, e)}>
                                                <use xlinkHref="#icon-workRight"></use>
                                            </svg>
                                            :
                                            <>
                                                <svg className="svg-icon" aria-hidden="true" onClick={e => onExpand(record, e)}>
                                                    <use xlinkHref="#icon-point"></use>
                                                </svg>
                                            </>
                                    )
                                }}
                            />
                        </Spin>
                    </div>
                </>

            </Col>
        </Row>
    );
}

export default withRouter(inject("workStore")(observer(WorkTableContent)));