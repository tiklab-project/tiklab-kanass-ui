import React, {useEffect, useRef, useState} from "react";
import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import {LeftOutlined} from "@ant-design/icons";
import {Col, Input, message, Row, Space, Spin, Table, Tooltip} from "antd";
import "./TodoList.scss"
import WorkStore from "../../../work/store/WorkStore";
import {SelectItem, SelectSimple} from "../../../common/select";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import HomeStore from "../store/HomeStore";
import {getUser} from "tiklab-core-ui";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectStore from "../../../project/project/store/ProjectStore";

const TodoList = (props) => {
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore,
        homeStore: HomeStore
    };

    const { workId, setWorkId, findWorkTypeDmList, tabValue, setTabValue, eveWorkTypeNum,todoListTotal,
        findWorkItemPageTreeWhenTodo, todoListPageCondition, setTodoListPageCondition, cleanTodoListPageCondition,
        findWorkItemNumWhenTodo, deleteWorkItem, setWorkIndex, getWorkStatus } = WorkStore;
    const {todoActiveKey} = HomeStore;
    const {findProjectList, projectList} = ProjectStore

    // const [projectId, setProjectId] = useState(null);
    // 面包屑第一个标题
    const [firstText, setFirstText] = useState();
    const projectId = props.match.params.id;
    const versionId = props.match.params.version;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const path = props.match?.path;

    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);

    const [moreTabValue, setMoreTabValue] = useState();
    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();

    const [inputValue, setInputValue] = useState(null);

    const [tableInfo, setTableInfo] = useState([]);
    const [loading, setLoading] = useState(false)
    // const [workId, setWorkId] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef();

    const [searchParam, setSearchParam] = useState()
    const [todoLabel, setTodoLabel] = useState();

    // 初始化
    useEffect(async () => {
        setLoading(true)
        // 初始化事项类型
        // 获取系统内置事项类型
        findWorkTypeDmList({projectId: projectId, grouper: "system"}).then(res => {
            if (res.code === 0) {
                setWorkSystem(res.data)
            }
        })

        // 获取自定义事项类型
        findWorkTypeDmList({projectId: projectId, grouper: "custom"}).then(res => {
            if (res.code === 0) {
                setWorkCustom(res.data)
                if (res.data.length > 0) {
                    setMoreTabValue(res.data[0].workType)
                }
            }
        })


        // 项目列表
        if (projectSetId){
            findProjectList({projectSetId:  projectSetId});

        }else {
            findProjectList();
        }

        // 初始化查询参数
        // let param = {
        //     orderParams: [{
        //         name: "code",
        //         orderType: "desc"
        //     }],
        //     pageParam: {
        //         pageSize: 20,
        //         currentPage: 1,
        //         total: 1
        //     },
        //     projectId: projectId,
        //     sprintId: sprintId,
        //     versionId: versionId,
        //     assignerIds: getUser().id
        // }
        setTodoListPageCondition({
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            assignerId: getUser().userId,
        })

        console.log("todoActiveKey:  " + todoActiveKey)
        if (todoActiveKey === 0) {
            // 待办
            setTodoListPageCondition({
                workStatusIds: ["todo"],
                overdue: null
            })
            setTodoLabel("待办")
        }
        else if (todoActiveKey === 1) {
            // 进行中
            const res = await getWorkStatus();
            let progressArray = [];
            res.map(item => {
                if (item.status === "PROGRESS") {
                    progressArray.push(item.id)
                }
            });
            setTodoListPageCondition({
                workStatusIds: progressArray,
                overdue: null
            })
            setTodoLabel("进行中")
        }
        else if (todoActiveKey === 2) {
            // 完成
            setTodoListPageCondition({
                workStatusIds: ["done"],
                overdue: null
            })
            setTodoLabel("已完成")
        }
        else {
            // 逾期
            setTodoListPageCondition({
                workStatusIds: null,
                overdue: true
            })
            setTodoLabel("已逾期")
        }
        // setSearchParam(todoListPageCondition);

        // 初始化表格数据
        findWorkItemNumWhenTodo(todoListPageCondition);
        findWorkItemPageTreeWhenTodo(todoListPageCondition).then((res) => {
            setTableInfo(res.data)
        })

        if (props.route?.path === "/project/:id/workTodo") {
            const projectId = props.match.params.id;
            setFirstText("项目概况")
        }
        if (props.route?.path === "/index/todoList") {
            setFirstText("首页")
        }

        if (props.route?.path === "/projectSet/:projectSetId/workTodo") {
            setFirstText("项目集概况")
        }

        if (props.route?.path === "/:id/sprint/:sprint/workTodo") {
            setFirstText("迭代概况")
        }
        if (props.route?.path === "/:id/version/:version/workTodo") {
            setFirstText("版本概况")
        }
        setLoading(false)
        return;
    }, [])


    /**
     * 关闭更多事项类型弹窗
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [setShowMoreTab])

    const closeModal = (e) => {
        if (!tabsDropDown.current) {
            return;
        }
        if (!tabsDropDown.current.contains(e.target) && tabsDropDown.current !== e.target) {
            setShowMoreTab(false)
        }
    }

    /**
     * 选择自定义事项类型
     * @param {事项类型} value
     */
    const selectCustomType = (value) => {
        setMoreTabValue(value)
        search({ workTypeId: value.id })
        setTabValue({
            id: value.id,
            type: "custom",
            value: value.id,
            label: value.name
        })
        setShowMoreTab(false)
    }

    /**
     * 选择事项类型
     * @param {事项类型} value
     */
    const selectType = (value) => {
        if (value === "all") {
            search({
                workTypeId: "",
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
            setTabValue({
                id: "all",
                type: "system",
                value: null,
                label: null
            })
        } else {
            setTabValue({
                id: value.id,
                type: "system",
                value: value.id,
                label: value.name
            })
            search({
                workTypeId: value.id,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    /**
     * 搜索事项
     * @param {搜索条件} values
     */
    const search = value => {
        setTodoListPageCondition(value)
        searchWorkList()
    };

    const inputChange = (field, value) => {
        setInputValue(value)

        setSearchParam({
            ...searchParam,
            keyWord: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        })
        setTodoListPageCondition({keyWord: value})
        // searchWorkList(searchParam)
    }

    const selectChange = (value) => {
        setSearchParam({
            ...searchParam,
            projectIds: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        })
    }

    const searchWorkList = (values) => {
        console.log("查询的参数：    " + JSON.stringify(values))
        setTodoListPageCondition(values)
        // 事项类型下的事项个数
        findWorkItemNumWhenTodo(todoListPageCondition);
        // 搜索事项
        findWorkItemPageTreeWhenTodo(todoListPageCondition).then((res) => {
            if(res.code === 0){
                setTableInfo(res.data)
            }
        })
    }

    // 当 searchParam 变化时触发搜索
    useEffect(() => {
        if (searchParam != null){
            console.log("更新后的参数", JSON.stringify(searchParam));
            searchWorkList();
        }
    }, [searchParam]); // 依赖项为 searchParam

    /**
     * 设置事项数量
     * @param {事项数量} num
     * @returns {事项数量}
     */
    const setWorkNum = (num) => {
        let showNum;
        const isMax = Math.floor(num / 1000);
        if(isMax >= 1){
            showNum = `${isMax}k+`
        }else {
            showNum = num;
        }
        return showNum;
    }

    const goDetail = (record, index) => {
        setWorkId(record.id)
        setWorkIndex(index + 1)

        setSessionStorage("detailCrumbArray", [{ id: record.id, code: record.code, title: record.title, iconUrl: record.workTypeSys.iconUrl }])
        const pathname = props.match.url;
        props.history.push(`${pathname}/${record.id}`)
        setIsModalVisible(true)
        // props.history.push(`/project/${record.project.id}/work/${record.id}`);
    }

    const columns=[
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            width: "20%",
            render: (text, record, index) => <div className="work-id work-first-col" onClick={() => goDetail(record, index)}>
                <div className="work-icon">
                    <ImgComponent
                        src={record.workTypeSys?.iconUrl}
                        alt=""
                        className="menu-icon"

                    />
                </div>
                <div className="work-key">{record.code}</div>
            </div>
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: "50%",
            render: (text, record, index) => <Space onClick={() => goDetail(record, index)}>
                <Tooltip title={record.title}>
                    <div className="work-title">
                        {record.title.length > 28 ? record.title.substring(0, 28) + "..." : record.title}
                    </div>
                </Tooltip>
            </Space>

        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            width: "10%",
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        alt=""
                        // isRemote={true}
                        className="img-icon-right"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            width: "10%",
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },
        {
            title: '事项类型',
            dataIndex: 'workTypeSys',
            key: 'workTypeSys',
            ellipsis: true,
            width: "10%",
            render: (text, record) => record.workTypeSys.name
        },
        {
            title: '创建人',
            dataIndex: 'builder',
            key: 'builder',
            ellipsis: true,
            width: "15%",
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={record.builder.nickname} /></div>
                <div className="work-info-text work-info-master-text" title = {record.builder.nickname}>{record.builder.nickname}</div>
            </div>
        },
        {
            title: '项目',
            dataIndex: ['project', 'projectName'],
            key: 'project',
            ellipsis: true,
            width: "20%",
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.project?.iconUrl}
                        alt=""
                        className="img-icon-right"
                    />

                </div>
                <div className="work-info-text">{text.length > 10 ? text.slice(0, 10) + "..." : text}</div>
            </div>

        },
        // {
        //     title: "操作",
        //     key: "action",
        //     width: "50px",
        //     render: (text, record, index) => (
        //         <Space size="middle">
        //             <DeleteModal deleteFunction={deleteItem} id={record.id} />
        //         </Space>
        //
        //     ),
        // },
    ];

    // 设置状态类型
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

    const deleteItem  = (id) => {
        setLoading(true)
        deleteWorkItem(id).then(res => {
            if (res.code === 0){
                searchWorkList();
            }
        })
        setLoading(false)
    }

    const changePage = (page, pageSize) => {
        // setSearchParam({
        //     ...searchParam,
        //
        // })
        searchWorkList({
            pageParam: {
                pageSize: 20,
                currentPage: page,
            }})
    }

    const delectCurrentWorkItem = () =>{
        message.warning("待办页面不允许删除事项")
    }


    return  (
        <Provider {...store}>
            <Row style={{ height: "100%", overflow: "auto", background: "#fff" }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="todo-list-page">
                        <div className="todo-header">
                        <Breadcrumb
                            {...props}
                            firstText={firstText}
                            secondText={"待办"}
                        />
                        </div>
                        <div className="table-top">
                            <div className="worktype-tabs">
                                <div
                                    className={`tabs-bar ${tabValue?.id === "all" ? "tabs-bar-select" : ""}`}
                                    onClick={() => selectType("all")} key={"all"}
                                >
                                    全部
                                    <span className="tabe-bar-num">{setWorkNum(eveWorkTypeNum.all)}</span>
                                </div>
                                {
                                    workSystem && workSystem.map(item => {
                                        return <div
                                            key={item.id}
                                            className={`tabs-bar ${tabValue?.id === item.workType.id ? "tabs-bar-select" : ""}`}
                                            onClick={() => selectType(item.workType)}
                                        >
                                            {item.workType.name}
                                            <span className="tabe-bar-num">{setWorkNum(eveWorkTypeNum[item.workType.code])}</span>
                                        </div>
                                    })
                                }
                                {
                                    workCustom && workCustom.length === 1 && <div className="tabs-more">
                                        <div className="tabs-more-button" onClick={() => selectCustomType(moreTabValue)}>
                                            <div className={`tabs-bar ${tabValue?.id === moreTabValue?.id ? "tabs-bar-select" : ""}`}>{moreTabValue?.name}</div>
                                        </div>
                                    </div>
                                }
                                {
                                    workCustom && workCustom.length > 1 && <div className="tabs-more">
                                        <div className="tabs-more-button" onClick={() => setShowMoreTab(true)}>
                                            <div className={`tabs-bar ${tabValue.type === "custom" ? "tabs-bar-select" : ""}`}>{moreTabValue?.name}</div>
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-downdrop"></use>
                                            </svg>
                                        </div>

                                        <div ref={tabsDropDown} className={`tabs-dropdown ${showMoreTab ? "tabs-dropdown-show" : "tabs-dropdown-hidden"}`}>
                                            {
                                                workCustom.map(item => {
                                                    return <div key={item.id} className={`tabs-dropdown-item ${tabValue?.id === item.workType.id ? "tabs-dropdown-select" : ""}`} onClick={() => selectCustomType(item.workType)}>{item.workType.name.length > 5 ? item.workType.name.substring(0,4) + "..." : item.workType.name}</div>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="table-top-right">
                                <div className="worklist-table-todo-label">
                                    {todoLabel}
                                </div>
                                {/*搜索框*/}
                                <div className="worklist-table-search">
                                    <div className="search-input">
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-search"></use>
                                        </svg>
                                        <Input bordered={false} allowClear
                                               className="workList-search-input"
                                               key={"search"}
                                               onChange={(value) => inputChange("keyWord", value.target.value)}
                                               placeholder="搜索标题、ID"
                                               value={inputValue}
                                        />
                                    </div>
                                </div>
                                {/*项目下拉框*/}
                                {
                                    (props.route.path === "/index/todoList" || props.route.path === "/projectSet/:projectSetId/workTodo") &&
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
                                                    imgUrl={item.iconUrl}
                                                />
                                            })
                                        }
                                    </SelectSimple>
                                }
                            </div>
                        </div>

                        <div className="work-table-content">
                            <Spin spinning={loading} tip="加载中">
                                <Table
                                    scroll={{
                                        x: "100%"
                                    }}
                                    columns={columns}
                                    dataSource={tableInfo.dataList}
                                    rowKey={(record) => record.id}
                                    showSorterTooltip={false}
                                    loading={loading}
                                    rowClassName={(record, index) => record.id === workId ? "work-table-select" : ""}
                                    pagination={{
                                        total: todoListTotal,
                                        pageSize: todoListPageCondition.pageParam.pageSize,
                                        current: todoListPageCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        showTotal: () => `共${tableInfo.totalRecord}条`
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
        </Provider>

    )
}

export default withRouter(observer(TodoList));