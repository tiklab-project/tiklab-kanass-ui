import AppraisedWorkItemStore from "../sotre/AppraisedWorkItemStore";
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
import AppraisedAddModal from "../../../project/appraised/components/AppraisedAdd";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import "./AppraisedWorkItemTable.scss"
import AppraisedWorkItemDetailDrawer from "./AppraisedWorkItemDetailDrawer";
import workStore from "../../../work/store/WorkStore";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";

const AppraisedWorkItemTable = (props) => {
    const store = {appraisedWorkItemStore: AppraisedWorkItemStore, workStore: WorkStore, workCalendarStore: WorkCalendarStore}
    // const workStore = {workStore: WorkSort}
    // const workCalendarStore = {workCalendarStore: WorkCalendarStore}
    const [tableList, setTableList] = useState([]);
    const {searchAppraisedWorkItemPage, searchCondition,
        total, setRecordId, deleteAppraisedWorkItem, appraisedWorkItemList} = AppraisedWorkItemStore;
    const {setWorkId, workId} = workStore;

    // 项目id 评审id
    const projectId = props.match.params.id;
    const appraisedId = props.match.params.appraised;
    const [showAddModel, setShowAddModel] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);

    // const [recordId, setRecordId] = useState("");
    const handleAddClick = () => {
        // 打开关联事项页面
        setShowAddModel(true);
    }

    useEffect(() => {
        searchTable({appraisedId: appraisedId});
    },[])

    const onSearch  = (value) => {
        console.log(value);
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
        console.log("关联id：   "+record.id);
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
            render: (text, record, index) => <Space >
                <ImgComponent
                    src={record.workItem.workTypeSys?.iconUrl}
                    alt=""
                    className="menu-icon"
                />
                <div className="appraised-key">{record.workItem.code}</div>
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
                    {record.workItem.title.length > 28 ? record.workItem.title.substring(0, 28) + "..." : record.workItem.title}
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

    return <Provider {...store}>
        <div className={`project-appraised`}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-appraised-list">
                        <Breadcumb firstText="需求列表">
                            <Button onClick={handleAddClick} buttonText={"关联需求"} />
                        </Breadcumb>
                        <div className="appraised-filter">
                            <div className="appraised-tabs">
                                {/*<WorkTypeTab*/}
                                {/*    workStore={WorkStore}*/}
                                {/*    workCalendarStore={WorkCalendarStore}*/}
                                {/*></WorkTypeTab>*/}
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