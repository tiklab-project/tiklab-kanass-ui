import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkTable.scss";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkBreadCrumb from "./WorkBreadCrumb";
import WorkTableFilter from "./WorkTableFilter";
import WorkDetail from "./WorkDetail";
const WorkTableContent = (props) => {
    const path = props.match.path.split("/")[2];
    const { workStore, form } = props
    const { workList, total, searchCondition, getWorkConditionPageTree, setIndexParams,
        detWork, workShowType, getWorkConditionPage, viewType, setWorkId, setDetailCrumbArray, setWorkIndex } = workStore;
    const workType = props.match.params.type ? props.match.params.type : null;
    const [workTypeText, setWorkTypeText] = useState("");
    const [isWorkList, setIsWorkList] = useState(true)
    console.log(props)
    const goProdetail = (record, index) => {
        console.log(record, "record")
        setWorkId(record.id)
        setWorkIndex(index + 1)
        setDetailCrumbArray([{ id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl }])
        setIsWorkList(false)
        // if (projectId) {

        //     props.history.push(`/index/${path}/${projectId}/WorkDetail`)
        // }
        // if (urlPath === "/index/work/worklist") {
        //     props.history.push(`/index/work/WorkDetail`)
        // }
        // if (urlPath === "/index/sprintdetail/:sprint/workDetail") {
        //     props.history.push(`/index/sprintdetail/${sprintId}/WorkDetail`)
        // }

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
                                src={'/images/' + record.workTypeSys.iconUrl}
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
            dataIndex: ['assigner', 'name'],
            key: 'assignerId',
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon /></div>
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
                            src={'/images/' + record.project?.iconUrl}
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
                    {/* <span className = "span-botton" onClick={()=>deleteWork(record.id)}>删除</span>
                    <span className = "span-botton" onClick={()=>eidtWork(record.id,record.title)}>编辑</span>
                    <span className = "span-botton">更多</span> */}
                </Space>
            ),
        }
    ];


    useEffect(() => {
        switch (workType) {
            case "task":
                setWorkTypeText("任务");
                break;
            case "demand":
                setWorkTypeText("需求");
                break;
            case "defect":
                setWorkTypeText("缺陷");
                break;
            case "epic":
                setWorkTypeText("史诗");
                break;
            default:
                setWorkTypeText("事项");
                break;
        }
    }, [workType])


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
                getWorkConditionPageTree(values)
            }
            if (viewType === "tile") {
                getWorkConditionPage(values)
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
                {
                    isWorkList ? <>
                        <div className="work-list-col">
                            <WorkBreadCrumb />
                            <WorkTableFilter form={form} />
                        </div>
                        <div style={{ overflow: "hidden" }} className="work-table">
                            <Table
                                columns={columns}
                                dataSource={workList}
                                rowKey={(record) => record.id}
                                onChange={sorter}
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
                        </div>
                    </>
                        :
                        <WorkDetail setIsWorkList={setIsWorkList} {...props} />

                }

            </Col>
        </Row>
    );
}

export default inject("workStore")(observer(WorkTableContent))