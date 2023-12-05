import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Row, Col, Spin, Popconfirm } from 'antd';
import { observer, Provider } from "mobx-react";
import "./WorkTable.scss";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import WorkDetailDrawer from "./WorkDetailDrawer";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkStore from "../store/WorkStore";
import { finWorkList } from "./WorkGetList";
import { renderRoutes } from "react-router-config";
import setImageUrl from "../../common/utils/setImageUrl";
import { removeTableTree } from "../../common/utils/treeDataAction";

const WorkTable = (props) => {
    // const { form } = props

    const { workList, total, searchCondition, getWorkConditionPageTree, tableLoading,
        detWork, getWorkConditionPage, viewType, setWorkId, setWorkShowType, workId,
        createRecent, setWorkIndex, setQuickFilterValue, treeIndex, setTreeIndex, setWorkList, workShowType } = WorkStore;
    const tenant = getUser().tenant;
    const projectId = props.match.params.id;
    const { route } = props;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef();

    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    useEffect(() => {
        setWorkShowType("table")
        console.log(workShowType)
        setQuickFilterValue({
            value: "pending",
            label: "我的待办"
        })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId
        }
        finWorkList(path, WorkStore, params);
        return;
    }, [projectId])

    // let [treeIndex, setTreeIndex] = useState([])

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

        // 层级的索引
        treeIndex.length = 0;
        setTreeIndex(treeIndex)
        getWorkLevelIndex(record.treePath, record.id)


        setSessionStorage("detailCrumbArray", [{ id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl }])
        setIsModalVisible(true)
        console.log(props)
        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
    }

    const getWorkLevelIndex = (value, workId) => {
        let treePath = value;
        if (typeof (treePath) === "string" && treePath.length > 0) {
            const hightLevel = treePath.split(";");
            hightLevel.unshift(workId)
            let hightLevelIndex = hightLevel.length - 2;

            const getIndex = (data, hightLevelIndex) => {
                const num = data.findIndex((item) => item.id === hightLevel[hightLevelIndex])
                hightLevelIndex--;
                treeIndex.push(num)
                if (hightLevelIndex >= 0) {
                    getIndex(data[num].children, hightLevelIndex);
                }
            }
            getIndex(workList, hightLevelIndex);
            setTreeIndex([...treeIndex])
        }
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
                        record.workTypeSys.iconUrl ?
                            <img
                                src={setImageUrl(record.workTypeSys?.iconUrl)}
                                alt=""
                                className="icon-32"

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="icon-32"
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
                <Space size="middle">
                    <Popconfirm
                        title="确定删除事项?"
                        onConfirm={() => deleteWork(record.id)}
                        // onCancel={cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <svg className="cancel-svg" aria-hidden="true" style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
                    </Popconfirm>

                    {/* <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-more"></use>
                    </svg> */}
                </Space>
            ),
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
                        record.workTypeSys.iconUrl ?
                            <img
                                src={setImageUrl(record.workTypeSys?.iconUrl)}
                                alt=""
                                className="icon-32"

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="icon-32"
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
                <Space size="middle">
                    {/* <svg className="svg-icon" aria-hidden="true" onClick={() => goProdetail(record)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg> */}
                    <Popconfirm
                        title="确定删除事项?"
                        onConfirm={() => deleteWork(record.id)}
                        // onCancel={cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <svg className="cancel-svg" aria-hidden="true" style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
                    </Popconfirm>

                    {/* <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-more"></use>
                    </svg> */}
                </Space>
            ),
        }
    ];

    // 改变页数
    const changePage = (page, pageSize) => {
        console.log(page, pageSize)
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

    // 删除事项
    const deleteWork = (id) => {
        detWork(id).then(() => {
            removeTableTree(workList, id)
            if (workList.length == 0) {
                if (viewType === "tree") {
                    getWorkConditionPageTree()
                }
                if (viewType === "tile") {
                    getWorkConditionPage()
                }
            } else {
                setWorkList([...workList])
            }
        })
    }



    return (
        <Provider {...store}>
            <Row style={{ height: "100%", overflow: "auto", background: "#fff" }}>
                <Col className="work-col" sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="work-table">
                        <WorkTableHead />
                        <WorkTableFilter />
                        <div className="work-table-content">
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
                        {...props}
                    />
                </Col>
            </Row>
        </Provider>

    );
}

export default withRouter(observer(WorkTable));