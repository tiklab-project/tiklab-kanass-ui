import AppraisedWorkItemStore from "../store/AppraisedWorkItemStore";
import React, {useEffect, useState} from 'react';
import {Col, Row, Space, Table, Tooltip} from "antd";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import Button from "../../../common/button/Button";
import WorkStore from "../../../work/store/WorkStore";
import AppraisedWorkItemAddModel from "./AppraisedWorkItemAddModel";
import {observer, inject, Provider} from "mobx-react";
import {withRouter} from "react-router";
import WorkTypeTab from "../../../work/components/WorkTypeTab";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import AppraisedAddModal from "./AppraisedAdd";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import "./AppraisedWorkItemTable.scss"
import AppraisedWorkItemDetailDrawer from "./AppraisedWorkItemDetailDrawer";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import AppraisedStores from "../store/AppraisedStores";

const AppraisedWorkItemTable = (props) => {
    const store = {appraisedWorkItemStore: AppraisedWorkItemStore, workStore: WorkStore, workCalendarStore: WorkCalendarStore}
    // const workStore = {workStore: WorkSort}
    // const workCalendarStore = {workCalendarStore: WorkCalendarStore}
    const [tableList, setTableList] = useState([]);
    const {searchAppraisedWorkItemPage, searchCondition,
        total, setRecordId, deleteAppraisedWorkItem, appraisedWorkItemList} = AppraisedWorkItemStore;
    const {setWorkId, workId} = WorkStore;
    const {searchAppraisedById} = AppraisedStores;

    // 项目id 评审id
    const projectId = props.match.params.id;
    const appraisedId = props.match.params.appraised;
    const [showAddModel, setShowAddModel] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [appraised, setAppraised] = useState();

    // tab的key
    const [activeTabs, setActiveTabs] = useState("all");
    const handleAddClick = () => {
        // 打开关联事项页面
        setShowAddModel(true);
    }

    useEffect(() => {
        searchTable({appraisedId: appraisedId, workItemTitle: null, workItemAppraisedState: null});
        searchAppraisedById(appraisedId).then(res => {
            // console.log("appraised:     "+JSON.stringify(res));
            setAppraised(res.data);
        })
    },[])

    const onSearch  = (value) => {
        searchTable({workItemTitle: value})
    }

    const deleteItem = (id) => {
        console.log(id)
        deleteAppraisedWorkItem(id).then(res => {
            searchTable();
        })
    }

    const appraisedWorkItemState = {
        "0":"待评审",
        "1":"通过",
        "2":"不通过",
        "3":"建议"

    }

    const goDetail = (record) => {
        setRecordId(record.id);
        setWorkId(record.workItem.id)
        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
        setDetailVisible(true);

    }

    const getState = (state) => {
        if (state === "0"){
            return<Space>
                <svg className="icon-20" aria-hidden="true">
                    <use xlinkHref="#icon-unAppraised"></use>
                </svg>
                <div >
                    {appraisedWorkItemState[state]}
                </div>
            </Space>
        }
        if (state === "1"){
            return<Space>
                <svg className="icon-20" aria-hidden="true">
                    <use xlinkHref="#icon-pass"></use>
                </svg>
                <div >
                    {appraisedWorkItemState[state]}
                </div>
            </Space>
        }
        if (state === "2"){
            return<Space>
                <svg className="icon-20" aria-hidden="true">
                    <use xlinkHref="#icon-unPass"></use>
                </svg>
                <div >
                    {appraisedWorkItemState[state]}
                </div>
            </Space>
        }
        if (state === "3"){
            return<Space>
                <svg className="icon-20" aria-hidden="true">
                    <use xlinkHref="#icon-advice"></use>
                </svg>
                <div >
                    {appraisedWorkItemState[state]}
                </div>
            </Space>
        }
    }

    const columns=[
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            width: "20%",
            render: (text, record, index) => <Space onClick={() => goDetail(record)}>
                <ImgComponent
                    src={record.workItem.workTypeSys?.iconUrl}
                    alt=""
                    className="menu-icon"
                />
                <div className="appraised-code">{record.workItem.code}</div>
            </Space>
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: "50%",
            render: (text, record) => <Space onClick={() => goDetail(record)}>
                <Tooltip title={record.workItem.title}>
                    <div className="appraised-name">
                        {record.workItem.title.length > 28 ? record.workItem.title.substring(0, 28) + "..." : record.workItem.title}
                    </div>
                </Tooltip>
            </Space>

        },
        {
            title: '事项类型',
            dataIndex: 'workTypeSys',
            key: 'workTypeSys',
            ellipsis: true,
            width: "10%",
            render: (text, record) => record.workItem.workTypeSys.name
        },
        {
            title: '创建人',
            dataIndex: 'builder',
            key: 'builder',
            ellipsis: true,
            width: "15%",
            render: (text, record) => <Space>
                <UserIcon userInfo={record.workItem.builder?.id} name={record.workItem.builder?.nickname} />
                {record.workItem.builder.name}
            </Space>
        },
        {
            title: '评审结果',
            dataIndex: 'workItemAppraisedState',
            key: 'workItemAppraisedState',
            ellipsis: true,
            width: "15%",
            render: (text, record) =>
                getState(record.workItemAppraisedState)
                // <div className={`appraised-status ${record.workItemAppraisedState === 1}`}>
                //     appraisedWorkItemState[record?.workItemAppraisedState]?.name
                // </div>

        },
        {
            title: "操作",
            key: "action",
            width: "50px",
            render: (text, record, index) => (
                <Space size="middle">
                    <DeleteModal deleteFunction={deleteItem} id={record.id} />
                </Space>

            ),
        },
    ];

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: 10,
                currentPage: page,
            }
        }
        searchTable(values);
    }

    const searchTable = (values) => {
        searchAppraisedWorkItemPage(values).then(res => {
            setTableList(res.data.dataList)
        });
    }

    /**
     * tab 数组
     */
    const statusTab = [
        {
            title: '全部',
            key: 'all',
            icon: "all"
        },
        {
            title: '待评审',
            key: 'unAppraised',
            icon: "programconcern"
        },
        {
            title: '通过',
            key: 'pass',
            icon: "programconcern"
        },
        {
            title: '未通过',
            key: 'unPass',
            icon: "programconcern"
        },
        {
            title: '建议',
            key: 'advice',
            icon: "programconcern"
        }
    ]

    /**
     * tab 切换
     * @param {tab key} key
     */
    const selectTabs = (key, page) => {
        setActiveTabs(key)
        const params = {
            // projectId: projectId,
            pageParam: {
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: page,
            }
        }
        console.log(key);
        switch (key) {
            case "all":
                searchAppraisedWorkItemPage({ workItemAppraisedState : null, ...params }).then(res => {
                    setTableList(res.data.dataList)
                });
                break;
            case "unAppraised":
                searchAppraisedWorkItemPage({ workItemAppraisedState : "0", ...params }).then(res => {
                    setTableList(res.data.dataList)
                });
                break;
            case "pass":
                searchAppraisedWorkItemPage({ workItemAppraisedState : "1", ...params }).then(res => {
                    setTableList(res.data.dataList)
                });
                break;
            case "unPass":
                searchAppraisedWorkItemPage({ workItemAppraisedState : "2", ...params }).then(res => {
                    setTableList(res.data.dataList)
                });
                break;
            case "advice":
                searchAppraisedWorkItemPage({ workItemAppraisedState : "3", ...params }).then(res => {
                    setTableList(res.data.dataList)
                });
                break;
            default:
                break;
        }
    }

    const goBack = () => {
        props.history.push(`/project/${projectId}/appraised`)
    }

    return <Provider {...store}>
        <div className={`project-appraised`}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-appraised-list">
                        <div className={"appraised-top"}>
                            <svg className="icon-25" aria-hidden="true" onClick={goBack}>
                                <use xlinkHref="#icon-left"></use>
                            </svg>
                            <p className="appraised-title">{appraised?.name}</p>
                            <Button onClick={handleAddClick} buttonText={"关联需求"} />
                        </div>
                        <div className="appraised-filter">
                            <div className="appraised-tabs">
                                {
                                    statusTab.map(item => {
                                        return <div
                                            className={`appraised-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                            key={item.key}
                                            onClick={() => selectTabs(item.key, 1)}
                                        >
                                            {item.title}
                                        </div>
                                    })
                                }
                            </div>
                            <div className="appraised-filter-right">
                                <InputSearch
                                    placeholder="搜索评审"
                                    allowClear
                                    style={{ width: 200 }}
                                    onChange={onSearch}
                                />
                            </div>
                        </div>
                        <div className="project-appraised-contant">
                            <div className="appraised-table-box">
                                <Table
                                    columns={columns}
                                    dataSource={tableList}
                                    rowKey={(record) => record.id}
                                    pagination={{
                                        total: total,
                                        pageSize: searchCondition?.pageParam?.pageSize,
                                        current: searchCondition?.pageParam?.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        hideOnSinglePage: true,
                                        simple: true
                                    }}
                                    // loading={loading}
                                    onSearch={onSearch}
                                    scroll={{ x: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <AppraisedWorkItemAddModel
                showAddModel={showAddModel}
                setShowAddModel={setShowAddModel}
                appraisedWorkItemStore={AppraisedWorkItemStore}
                projectId={projectId}
                appraisedId={appraisedId}
                searchTable={searchTable}
                {...props}
            />
            <AppraisedWorkItemDetailDrawer
                visible={detailVisible}
                setVisible={setDetailVisible}
                searchTable={searchTable}
                {...props}
            />
        </div>
    </Provider>



}

export default withRouter(observer(AppraisedWorkItemTable));