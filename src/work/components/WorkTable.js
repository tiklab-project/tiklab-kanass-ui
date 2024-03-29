import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Row, Col, Spin, Popconfirm, Dropdown, Menu } from 'antd';
import { observer, Provider } from "mobx-react";
import "./WorkTable.scss";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { withRouter } from "react-router";
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import WorkDetailDrawer from "./WorkDetailDrawer";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkStore from "../store/WorkStore";
import { finWorkList } from "./WorkGetList";
import setImageUrl from "../../common/utils/setImageUrl";
import { removeNodeInTree, removeNodeInTreeAddChildren } from "../../common/utils/treeDataAction";
import DeleteModal from "../../common/deleteModal/deleteModal";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";

const WorkTable = (props) => {

    const { workList, total, searchCondition, getWorkConditionPageTree, tableLoading,
        deleteWorkItem, deleteWorkItemAndChildren, getWorkConditionPage, viewType, setWorkId, setWorkShowType, workId,
        createRecent, setWorkIndex, setQuickFilterValue, setWorkList, haveChildren } = WorkStore;

    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef();

    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    const moreMenu = (record) => {
        return <Menu onClick={() => selectWorkItem(record) }>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };

    const selectWorkItem = (record) => {
        setWorkId(record.id)
        setDeleteSelectModal(true)
    }

    useEffect(() => {
        setWorkShowType("table")
        setQuickFilterValue({
            value: "all",
            label: "全部"
        })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            epicView: null
        }
        finWorkList(path, WorkStore, params);
        return;
    }, [projectId])


    const goProdetail = (record, index) => {
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            project: { id: record.project.id },
            projectType: { id: record.project.projectType.id },
            iconUrl: record.workTypeSys?.iconUrl
        }
        createRecent(params)

        setWorkId(record.id)
        setWorkIndex(index + 1)

        setSessionStorage("detailCrumbArray", [{ id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl }])

        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
        setIsModalVisible(true)
    }


    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    //  排序
    const [sortArray, setSortArray] = useState(["title"]);
    const sorterTable = (pagination, filters, sorter, extra) => {

        const setSortParams = (sorter) => {
            const field = sorter.columnKey;
            const order = sorter.order;
            let isAsc = "";
            let sortType = "";
            if (order === "ascend") {
                isAsc = "asc"
            }
            if (order === "descend") {
                isAsc = "desc"
            }
            if (!order) {
                return
            }
            switch (field) {
                case "title":
                    sortType = "id";
                    break;
                case "assignerId":
                    sortType = "assigner_id";
                    break;
                case "builderId":
                    sortType = "builder_id";
                    break;
                case "project":
                    sortType = "project_id";
                    break;
                case "workPriority":
                    sortType = "work_priority_id";
                    break;
                case "workStatus":
                    sortType = "work_status_node_id";
                    break;
                case "buildTime":
                    sortType = "build_time";
                    break;
                default:
                    break;
            }

            const params = {
                name: sortType,
                orderType: isAsc
            }

            return params;
        }

        if (extra.action === "sort") {
            let orderParams = [];
            let sortArray = []
            if (!(sorter instanceof Array)) {
                if (sorter.order) {
                    orderParams.push(setSortParams(sorter));
                    sortArray.push(sorter.columnKey);
                } else {
                    orderParams.push({
                        name: "id",
                        orderType: "desc"
                    });
                    sortArray.push("title");
                }

            } else {
                sorter.map(item => {
                    orderParams.push(setSortParams(item));
                    sortArray.push(item.columnKey);
                })
            }
            setSortArray(sortArray)
            searchCondition.orderParams = orderParams;
            searchCondition.pageParam = {
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: 1
            }
            if (viewType === "tree") {
                getWorkConditionPageTree()
            }
            if (viewType === "tile") {
                getWorkConditionPage()
            }
        }


    }


    const workColumns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-name work-first-col" onClick={() => goProdetail(record, index)}>
                <div className="work-icon">
                    {
                        record.workTypeSys?.iconUrl ?
                            <img
                                src={setImageUrl(record.workTypeSys?.iconUrl)}
                                alt=""
                                className="menu-icon"

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="menu-icon"
                            />
                    }
                </div>
                <div className="work-key">{record.id}</div>
                <div className="work-text">{text}</div>
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            sorter: {
                multiple: 1
            },
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    {
                        record.workPriority?.iconUrl ? <img
                            src={'/images/' + record.workPriority?.iconUrl}
                            alt=""
                            className="img-icon-right"
                        />
                            :
                            <img
                                src={'/images/proivilege1.png'}
                                alt=""
                                className="img-icon-right"
                            />
                    }

                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '创建人',
            dataIndex: ['builder', 'nickname'],
            key: 'builderId',
            sorter: {
                multiple: 1
            },
            className: `${sortArray.indexOf("builderId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            sorter: {
                multiple: 1
            },
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },

        {
            title: '操作',
            width: "60",
            key: 'action',
            render: (text, record) => (
                // <DeleteModal deleteFunction={setDeleteSelectModal(false)} id={record.id} />
                <Dropdown
                    overlay={() => moreMenu(record)}
                    placement="bottomLeft"
                    trigger="click"
                    getPopupContainer={workTable ? () => workTable.current : null}
                >
                    <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-more"></use>
                    </svg>
                </Dropdown>
            )
        }
    ];

    const projectColums = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-name work-first-col" onClick={() => goProdetail(record, index)}>
                <div className="work-icon">
                    {
                        record.workTypeSys?.iconUrl ?
                            <img
                                src={setImageUrl(record.workTypeSys?.iconUrl)}
                                alt=""
                                className="menu-icon"

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="menu-icon"
                            />
                    }
                </div>
                <div className="work-key">{record.id}</div>
                <div className="work-text">{text}</div>
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    {
                        record.workPriority?.iconUrl ? <img
                            src={'/images/' + record.workPriority?.iconUrl}
                            alt=""
                            className="img-icon-right"
                        />
                            :
                            <img
                                src={'/images/proivilege1.png'}
                                alt=""
                                className="img-icon-right"
                            />
                    }

                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '创建人',
            dataIndex: ['builder', 'nickname'],
            key: 'builderId',
            className: `${sortArray.indexOf("builderId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 5
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
        {
            title: '项目',
            dataIndex: ['project', 'projectName'],
            key: 'project',
            className: `${sortArray.indexOf("project") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 7
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    {
                        record.project.iconUrl ? <img
                            src={setImageUrl(record.project?.iconUrl)}
                            alt=""
                            className="img-icon-right"
                        />
                            :
                            <img
                                src={'/images/project3.png'}
                                alt=""
                                className="img-icon-right"
                            />
                    }

                </div>
                <div className="work-info-text">{text}</div>
            </div>
        },

        {
            title: '操作',
            width: "60",
            key: 'action',
            render: (text, record) => (
                // <Space size="middle">
                //     <Popconfirm
                //         title="确定删除事项?"
                //         onConfirm={() => deleteWork(record.id)}
                //         // onCancel={cancel}
                //         okText="是"
                //         cancelText="否"
                //     >
                //         <svg className="cancel-svg" aria-hidden="true" style={{ cursor: "pointer" }}>
                //             <use xlinkHref="#icon-delete"></use>
                //         </svg>
                //     </Popconfirm>
                // </Space>
                // <DeleteModal deleteFunction={setDeleteSelectModal(false)} id={record.id} />
                <Dropdown
                    overlay={() => moreMenu()}
                    placement="bottomLeft"
                    trigger="click"
                    getPopupContainer={workTable ? () => workTable.current : null}
                >
                    <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-more"></use>
                    </svg>
                </Dropdown>
            ),
        }
    ];

    // 改变页数
    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
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



    const deleteWork = (deleteWorkItem, removeTree) => {
        deleteWorkItem(workId).then(() => {
            // 当第当前页被删完, 总页数大于当前页
            if (workList.length === 0) {
                // 当前页被删完, 总页数等于当前页， 往前移动一页
                if (currentPage === totalPage && currentPage > 1) {
                    const params = {
                        pageParam: {
                            pageSize: searchCondition.pageParam.pageSize,
                            currentPage: currentPage - 1
                        }
                    }
                    setWorkDeatilInList(WorkStore, params)
                } else if (currentPage === totalPage && currentPage <= 1) {
                    // 当前页被删完, 总页数等于当前页，而且是第一页
                    setWorkId(0)
                    setWorkIndex(0)
                } else if (currentPage < totalPage) {
                    setWorkDeatilInList(WorkStore)
                }
            } else {
                const node = removeTree(workList, null, workId);
                if (node != null) {
                    setWorkId(node.id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: node.id, title: node.title, iconUrl: node.workTypeSys?.iconUrl }])
                }
            }
            setWorkList([...workList])
        })
    }

    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem, removeNodeInTreeAddChildren)
        setIsModalVisible(false)
    }

    const delectWorkItemAndChildren = () => {
        deleteWork(deleteWorkItemAndChildren, removeNodeInTree)
        setIsModalVisible(false)
    }
    const [deleteSelectModal, setDeleteSelectModal] = useState(false)
    const getHaveChildren = () => {
        haveChildren({ id: workId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setDeleteSelectModal(true)
                } else {
                    delectCurrentWorkItem();
                }
            }
        })
    }
    const workTable = useRef()
    return (
        <Provider {...store}>
            <Row style={{ height: "100%", overflow: "auto", background: "#fff" }}>
                <Col className="work-col" sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="work-table" >
                        <WorkTableHead />
                        <WorkTableFilter />
                        <div className="work-table-content" ref={workTable}>
                            <Spin spinning={tableLoading} delay={500} >
                                <Table
                                    columns={props.location.pathname === "/workTable" ? projectColums : workColumns}
                                    dataSource={workList}
                                    rowKey={(record) => record.id}
                                    showSorterTooltip={false}
                                    rowClassName={(record, index) => record.id === workId ? "work-table-select" : ""}
                                    pagination={{
                                        total: total,
                                        pageSize: searchCondition.pageParam.pageSize,
                                        current: searchCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"]
                                    }}
                                    onChange={(pagination, filters, sorter, extra) => sorterTable(pagination, filters, sorter, extra)}
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
                                                    <div className="svg-icon">

                                                    </div>
                                                </>
                                        )
                                    }}
                                />
                            </Spin>
                        </div>
                    </div>
                    <WorkDetailDrawer
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        modelRef={modelRef}
                        showPage={true}
                        delectCurrentWorkItem={delectCurrentWorkItem}
                        delectWorkItemAndChildren={delectWorkItemAndChildren}
                        {...props}
                    />
                    <WorkDeleteSelectModal
                        deleteSelectModal={deleteSelectModal}
                        setDeleteSelectModal={setDeleteSelectModal}
                        getPopupContainer={workTable}
                        delectCurrentWorkItem={delectCurrentWorkItem}
                        delectWorkItemAndChildren={delectWorkItemAndChildren}
                    // getHaveChildren={getHaveChildren}
                    />
                </Col>
            </Row>
        </Provider>

    );
}

export default withRouter(observer(WorkTable));