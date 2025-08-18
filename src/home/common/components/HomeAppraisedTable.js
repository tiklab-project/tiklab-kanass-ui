import {observer, Provider} from "mobx-react";
import {withRouter} from "react-router";
import {Col, Progress, Row, Space, Table, Tooltip} from "antd";
import InputSearch from "../../../common/input/InputSearch";
import AppraisedWorkItemStatusDrawer from "../../../project/appraised/components/AppraisedWorkItemStatusDrawer";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import React, {useEffect, useState} from "react";
import AppraisedWorkItemStore from "../../../project/appraised/store/AppraisedWorkItemStore";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import WorkStore from "../../../work/store/WorkStore";
import ProjectStore from "../../../project/project/store/ProjectStore";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import AppraisedStores from "../../../project/appraised/store/AppraisedStores";
import { getUser } from 'tiklab-core-ui'
import "./HomeAppraisedTable.scss";
import {SelectItem, SelectSimple} from "../../../common/select";
import ColorIcon from "../../../common/colorIcon/ColorIcon";

const HomeAppraisedTable = (props) => {
    const store = {
        appraisedWorkItemStore: AppraisedWorkItemStore,
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore,
        projectStore: ProjectStore
    }

    const [tableList, setTableList] = useState([]);
    const {searchAppraisedWorkItemPage, searchCondition,
        total, setRecordId, deleteAppraisedWorkItem, appraisedWorkItemList} = AppraisedWorkItemStore;
    const {setWorkId, workId} = WorkStore;
    const {searchAppraisedById, status} = AppraisedStores;
    const {findProjectList, projectList} = ProjectStore

    const [detailVisible, setDetailVisible] = useState(false);
    const [statusVisible, setStatusVisible] = useState(false);

    // tab的key
    const [activeTabs, setActiveTabs] = useState("all");
    const userId = getUser().userId;

    useEffect(() => {
        findProjectList();
        searchTable({master: userId, workItemTitle: null, workItemAppraisedState: "0"});
    },[])


    const onSearch  = (value) => {
        searchTable({workItemTitle: value})
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
            width: "15%",
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
            title: '项目',
            dataIndex: ['workItem', 'project', 'projectName'],
            key: 'project',
            ellipsis: true,
            width: "15%",
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ColorIcon color={record.workItem.project?.color} name={record.workItem.project?.projectName} className="icon-20" />
                </div>
                <div className="work-info-text">{text.length > 10 ? text.slice(0, 10) + "..." : text}</div>
            </div>
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

    const selectChange = (value) => {
        const param = {
            projectIds: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        searchTable(param)
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

    return <Provider {...store}>
        <div className={`home-appraised`}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="home-appraised-list">
                        <div className="appraised-filter">
                            {/*<div className="appraised-tabs">*/}
                            {/*    {*/}
                            {/*        statusTab.map(item => {*/}
                            {/*            return <div*/}
                            {/*                className={`appraised-tab ${activeTabs === item.key ? "active-tabs" : ""}`}*/}
                            {/*                key={item.key}*/}
                            {/*                onClick={() => selectTabs(item.key, 1)}*/}
                            {/*            >*/}
                            {/*                {item.title}*/}
                            {/*            </div>*/}
                            {/*        })*/}
                            {/*    }*/}
                            {/*</div>*/}
                            <div className="appraised-filter-left">
                                {/*项目下拉框*/}
                                <SelectSimple
                                    name="projectIds"
                                    onChange={(value) => selectChange( value)}
                                    title={"项目"}
                                    ismult={true}
                                    suffixIcon = {true}
                                >
                                    {
                                        projectList.map(item => {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.projectName}
                                                key={item.id}
                                                color={item.color}
                                            />
                                        })
                                    }
                                </SelectSimple>

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
                        <div className="home-appraised-contant">
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
};

export default withRouter(observer(HomeAppraisedTable));