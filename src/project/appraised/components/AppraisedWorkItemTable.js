import AppraisedWorkItemStore from "../store/AppraisedWorkItemStore";
import React, {useEffect, useState} from 'react';
import {Col, Progress, Row, Space, Table, Tooltip} from "antd";
import InputSearch from "../../../common/input/InputSearch";
import Button from "../../../common/button/Button";
import WorkStore from "../../../work/store/WorkStore";
import AppraisedWorkItemAddModel from "./AppraisedWorkItemAddModel";
import {observer, inject, Provider} from "mobx-react";
import {withRouter} from "react-router";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import "./AppraisedWorkItemTable.scss"
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import AppraisedStores from "../store/AppraisedStores";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import AppraisedWorkItemStatusDrawer from "./AppraisedWorkItemStatusDrawer";

const AppraisedWorkItemTable = (props) => {
    const store = {appraisedWorkItemStore: AppraisedWorkItemStore, workStore: WorkStore, workCalendarStore: WorkCalendarStore}
    // const workStore = {workStore: WorkSort}
    // const workCalendarStore = {workCalendarStore: WorkCalendarStore}
    const [tableList, setTableList] = useState([]);
    const {searchAppraisedWorkItemPage, searchCondition,
        total, setRecordId, deleteAppraisedWorkItem, appraisedWorkItemList} = AppraisedWorkItemStore;
    const {setWorkId, workId} = WorkStore;
    const {searchAppraisedById, status} = AppraisedStores;

    // 项目id 评审id
    const projectId = props.match.params.id;
    const appraisedId = props.match.params.appraised;
    const [showAddModel, setShowAddModel] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [statusVisible, setStatusVisible] = useState(false);
    const [appraised, setAppraised] = useState();
    const [percent, setPercent] = useState(0);
    const [percentInfo, setPercentInfo] = useState("0 / 0");

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
            // const number = ((res.data.passAppraisedWorkItemNumber + unPassAppraisedWorkItemNumber) / res.data.allAppraisedWorkItemNumber).toFixed(2);
            // setPercent(number)
        })
    },[])

    useEffect(() => {
        if (appraised){
            setPercent(((appraised.passAppraisedWorkItemNumber + appraised.unPassAppraisedWorkItemNumber) * 100 / appraised.allAppraisedWorkItemNumber).toFixed(2))
            setPercentInfo((appraised.passAppraisedWorkItemNumber + appraised.unPassAppraisedWorkItemNumber) + " / " + appraised.allAppraisedWorkItemNumber)
        }

    }, [appraised]);

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
        "2":"不通过"

    }

    const goDetail = (record) => {
        setRecordId(record.id);
        setWorkId(record.workItem.id)
        const pathname = props.match.url;
        setSessionStorage("detailCrumbArray", [{ id: record.workItem.id, code: record.workItem.code, title: record.workItem.title, iconUrl: record.workItem.workTypeSys.iconUrl }])
        props.history.push(`${pathname}/${record.workItem.id}`)
        setDetailVisible(true);
    }

    const goAppraisedStatus = (record) => {
        setRecordId(record.id);
        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
        setStatusVisible(true);

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

    const getAppraisedState = (state) => {
        return <div className={`appraised-status ${setStatuStyle(state)}`}>
            {status[Number(state)]?.name}
        </div>
    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "0":
                name = "appraised-status-todo";
                break;
            case "1":
                name = "appraised-status-process";
                break;
            case "2":
                name = "appraised-status-done";
                break;
            default:
                name = "appraised-status-process";
                break;
        }
        return name;
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
                {record.workItem.builder.nickname}
            </Space>
        },
        {
            title: '评审意见',
            dataIndex: 'workItemAppraisedState',
            key: 'workItemAppraisedState',
            ellipsis: true,
            width: "15%",
            render: (text, record) =>
                <Space onClick={() => goAppraisedStatus(record)} style={{cursor: "pointer"}}>
                    {
                        getState(record.workItemAppraisedState)
                    }
                </Space>
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
                        <div className="appraised-top-info">
                            <div className="top-info-content">
                                <div className="left-info">
                                    <div className="info-title">状态：</div>
                                    <div>{getAppraisedState(appraised?.appraisedState)}</div>
                                    <div className="info-title">负责人：</div>
                                    <div>{appraised?.master.nickname}</div>
                                    <div className="info-title">开始时间：</div>
                                    <div>{appraised?.startTime.slice(0, 10)}</div>
                                    <div className="info-title">结束时间：</div>
                                    <div>{appraised?.endTime.slice(0, 10)}</div>
                                    <div className="info-title">描述：</div>
                                    <div style={{gridColumn: "2 / -1"}}>{appraised?.description ? appraised?.description : "-"}</div>
                                </div>
                                <div className="right-progress">
                                    <div className="info-title">评审进度</div>
                                    <div style={{margin: "10px 0"}}>
                                        <Progress
                                            percent={percent}
                                            status={"normal"}
                                            format={() => `${percentInfo}`}
                                        />
                                    </div>
                                    <div className="progress-info">
                                        {/*<div>*/}
                                        {/*    <div className="info-title">通过：</div>*/}
                                        {/*    <div>{appraised?.passAppraisedWorkItemNumber}</div>*/}
                                        {/*</div>*/}
                                        <div className="progress-info-content">
                                            <div className="info-title">未审批：</div>
                                            <div>{appraised?.allAppraisedWorkItemNumber - appraised?.passAppraisedWorkItemNumber - appraised?.unPassAppraisedWorkItemNumber}</div>
                                        </div>
                                        <div className="progress-info-content">
                                            <div className="info-title">所有：</div>
                                            <div>{appraised?.allAppraisedWorkItemNumber}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
            <AppraisedWorkItemStatusDrawer
                visible={statusVisible}
                setVisible={setStatusVisible}
                // recordId={}
                searchTable={searchTable}
                {...props}
            />

            <WorkDetailDrawer
                isModalVisible={detailVisible}
                setIsModalVisible={setDetailVisible}
                searchTable={searchTable}
                {...props}
            />
        </div>
    </Provider>
}

export default withRouter(observer(AppraisedWorkItemTable));