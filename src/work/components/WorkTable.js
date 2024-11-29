import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Row, Col, Spin, Popconfirm, Dropdown, Menu } from 'antd';
import { observer, Provider } from "mobx-react";
import "./WorkTable.scss";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { withRouter } from "react-router";
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import WorkDetailDrawer from "./WorkDetailDrawer";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkStore from "../store/WorkStore";
import { finWorkList } from "./WorkGetList";
import { removeNodeInTree, removeNodeInTreeAddChildren } from "../../common/utils/treeDataAction";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";
import { setWorkDeatilInList } from "./WorkSearch";
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { getColumn, getWorkColumn } from "./WorkTableColumn";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
const getScreenType = () => {
    const width = window.innerWidth;

    if (width >= 1600) {
        return 'xxl';
    } else if (width < 1600 && width >= 1200) {
        return 'xl';
    } else if (width < 1200 && width >= 992) {
        return 'lg';
    } else if (width < 992 && width >= 768) {
        return 'md';
    } else if (width < 768 && width >= 576) {
        return 'sm';
    } else if (width < 576) {
        return 'xs';
    }
}
const WorkTable = (props) => {
    const screenSize = useBreakpoint();
    const screenCode = getScreenType();
    const { workList, total, searchCondition, getWorkConditionPageTree, tableLoading,
        deleteWorkItem, getWorkConditionPage, viewType, setWorkId, setWorkShowType, workId,
        createRecent, setWorkIndex, setWorkList, haveChildren } = WorkStore;
        
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const stageId = props.match.params.stage ? props.match.params.stage : null;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef();
    const [projectColums, setProjectColums] = useState([])
    const [loading, setLoading] = useState(true)
    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    const moreMenu = (record) => {
        return <Menu onClick={() => selectWorkItem(record)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };

    const selectWorkItem = (record) => {
        setWorkId(record.id)
        setDeleteSelectModal(true)
        // getHaveChildren(record.id)
    }

    useEffect(async () => {
        setWorkShowType("table")
        // setQuickFilterValue({
        //     value: "all",
        //     label: "全部"
        // })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            stageId: stageId,
            epicView: null
        }
        await finWorkList(path, WorkStore, params);
        setLoading(false)
        return;
    }, [projectId, sprintId, versionId, stageId])


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

        setSessionStorage("detailCrumbArray", [{ id: record.id, code: record.code, title: record.title, iconUrl: record.workTypeSys.iconUrl }])

        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
        setIsModalVisible(true)
    }
    const actionColumn = {
        title: '操作',
        width: "60",
        key: 'action',
        render: (text, record) => (
            <PrivilegeProjectButton code={'WorkItemDelete'} domainId={projectId}  {...props}>
                <WorkDeleteSelectModal
                    deleteSelectModal={deleteSelectModal}
                    setDeleteSelectModal={setDeleteSelectModal}
                    getPopupContainer={workTable}
                    delectCurrentWorkItem={delectCurrentWorkItem}
                    haveChildren={haveChildren}
                    workId={record.id}
                    setWorkId={setWorkId}
                /> 
            </PrivilegeProjectButton>

        ),
    }



    //  排序
    const [sortArray, setSortArray] = useState(["id"]);
    const sorterTable = (pagination, filters, sorter, extra) => {

        const setSortParams = (sorter) => {
            const field = sorter.columnKey;
            const order = sorter.order;
            let isAsc = "desc";
            let sortType = "code";
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
                case "code":
                    sortType = "code";
                    break;
                case "title":
                    sortType = "title";
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
                case "moduleId":
                    sortType = "module_id";
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
                        name: "code",
                        orderType: "desc"
                    });
                    sortArray.push("id");
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


    useEffect(() => {

        if (props.location.pathname === "/workitem") {
            const column = getColumn(screenCode, goProdetail, sortArray, actionColumn)
            setProjectColums(column)
        } else {
            const column = getWorkColumn(screenCode, goProdetail, sortArray, actionColumn)
            setProjectColums(column)
        }
    }, [screenSize, workList])




    // 改变页数
    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }
        setLoading(true)
        if (viewType === "tree") {
            getWorkConditionPageTree(values).then(res => {
                setLoading(false)
            })
        }
        if (viewType === "tile") {
            getWorkConditionPage(values).then(res => {
                setLoading(false)
            })
        }
    }



    const deleteWork = (deleteWorkItem, removeTree, workId) => {
        console.log("second", workList)
        deleteWorkItem(workId).then(() => {
            // 当第当前页被删完, 总页数大于当前页
            if (workList.length === 1) {
                const currentPage = searchCondition.pageParam.currentPage
                // 当前页被删完, 总页数等于当前页， 往前移动一页
                if (currentPage === total && currentPage > 1) {
                    const params = {
                        pageParam: {
                            pageSize: searchCondition.pageParam.pageSize,
                            currentPage: currentPage - 1
                        }
                    }
                    setWorkDeatilInList(WorkStore, params)
                } else if (currentPage === total && currentPage <= 1) {
                    // 当前页被删完, 总页数等于当前页，而且是第一页
                    setWorkId(0)
                    setWorkIndex(0)
                    const node = removeTree(workList, null, workId);
                    setIsModalVisible(false)
                } else if (currentPage < total) {
                    setWorkDeatilInList(WorkStore)
                }
            } else {
                console.log("three", workList)
                const node = removeTree(workList, null, workId);
                if (node != null) {
                    setWorkId(node.id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: node.id, code: node.code, title: node.title, iconUrl: node.workTypeSys?.iconUrl }])
                }
            }
            setWorkList([...workList])
        })
    }

    const delectCurrentWorkItem = (workId) => {
        deleteWork(deleteWorkItem, removeNodeInTree, workId)
        setDeleteSelectModal(false)
    }

    const [deleteSelectModal, setDeleteSelectModal] = useState(false)

    const workTable = useRef()
    return (<Row style={{ height: "100%", overflow: "auto", background: "#fff" }}>
                <Col className="work-col" sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                    <div className={`work-table ${["sm", "md", "lg", "xl"].indexOf(getScreenType()) > -1 ? "work-table-small" : ""}`} >
                        <WorkTableHead />
                        <WorkTableFilter />
                        <div className="work-table-content" ref={workTable}>
                            <Spin spinning={tableLoading} tip="加载中">
                                <Table
                                    scroll={{
                                        x: "100%"
                                    }}
                                    columns={projectColums}
                                    dataSource={workList}
                                    rowKey={(record) => record.id}
                                    showSorterTooltip={false}
                                    loading={loading}
                                    rowClassName={(record, index) => record.id === workId ? "work-table-select" : ""}
                                    pagination={{
                                        total: total,
                                        pageSize: searchCondition.pageParam.pageSize,
                                        current: searchCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        showTotal: () => `共${total}条`
                                    }}
                                    onChange={(pagination, filters, sorter, extra) => sorterTable(pagination, filters, sorter, extra)}
                                    expandable={{
                                        expandIcon: ({ expanded, onExpand, record }) => (
                                            record.children && record.children.length > 0 ? expanded ?
                                                <svg className="icon-10" aria-hidden="true" onClick={e => onExpand(record, e)}>
                                                    <use xlinkHref="#icon-workDown"></use>
                                                </svg> :
                                                <svg className="icon-10" aria-hidden="true" onClick={e => onExpand(record, e)}>
                                                    <use xlinkHref="#icon-workRight"></use>
                                                </svg>
                                                :
                                                <>
                                                    <svg className="icon-10">

                                                    </svg>
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
                        {...props}
                    />

                </Col>
            </Row>

    );
}

export default withRouter(observer(WorkTable));