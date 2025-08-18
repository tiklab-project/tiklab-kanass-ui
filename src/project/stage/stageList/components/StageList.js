import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import ColorIcon from "../../../../common/colorIcon/ColorIcon";
import CircleProgress from "../../../../common/progress/CircleProgress";
import {Col, Row, Space, Table} from "antd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import React, {useEffect, useRef, useState} from "react";
import StageListStore from "../store/StageListStore";
import {removeNodeInTree} from "../../../stagePlan/component/StageListTreeChange";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../../common/input/InputSearch";
import WorkCreatDropdown from "../../../../work/components/workCreatDropdown";
import Button from "../../../../common/button/Button";
import StageAddModal from "./StageAddModal";
import StageEditModal from "./StageEditModal";
import WorkStore from "../../../../work/store/WorkStore";
import "./StageList.scss"

const StageList = (props) => {
    const store = {
        stageStore: StageListStore,
        workStore: WorkStore
    }
    const { findStageListTreePage, findStagePage, updateStage, stageList,setStageList, findWorkTypeDmList, workTypeList,
        deleteStage, stageCondition, total } = StageListStore;
    const { deleteWorkItem, deleteWorkItemAndChildren, workId } = WorkStore;
    // 添加子级的上级id
    const [parentId, setParentId] = useState();
    // 添加类型 子级，顶级
    const [addChild, setAddChild] = useState();
    // 添加弹窗的显示参数
    const [showStageAddMoal, setShowStageAddModal] = useState(false);
    const [showStageEditModal, setShowStageEditModal] = useState(false);
    // 项目id
    const projectId = props.match.params.id;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef();
    const [graph, setGraph] = useState();
    const [stageId, setStageId] = useState();
    const [deleteSelectModal, setDeleteSelectModal] = useState(false);
    const stageRef = useRef()
    const [loading, setLoading] = useState(false);
    const [viewType, setViewType] = useState("tile")
    /**
     * 获取阶段
     */
    useEffect(() => {
        /**
         * 获取第一级节点列表
         */
        setLoading(true)
        getStageList({ projectId: projectId })
        setLoading(false)
        // findWorkTypeDmList({ projectId: projectId })
        return;
    }, [viewType])


    // const changeMonth = () => {
    //     setArchiveView("month");
    //     graph.dispose()
    // }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }
        setLoading(true)
        getStageList(values)
        setLoading(false)
    }

    const setStatuStyle = (status) => {
        let name;
        switch (status) {
            case "0":
                name = "stage-status-todo";
                break;
            case "1":
                name = "stage-status-process";
                break;
            case "2":
                name = "stage-status-done";
                break;
            default:
                name = "stage-status-process";
                break;
        }
        return name;
    }

    /**
     * 根据标题搜索阶段
     * @param {标题} value
     */
    const onSearch = (value) => {

        getStageList({ stageName: value })
    }

    const getStageList = (value) => {
        if (viewType === "tile"){
            findStagePage( value)
        }else {
            findStageListTreePage(value).then(res => {
                // if(res.code === 0){
                //     setStageList(res.data)
                // }
            })
        }

    }

    /**
     * x显示添加弹窗
     */
    const addStage = () => {
        setShowStageAddModal(true)
        setAddChild("father")
        setParentId(null)
    }

    const deleteStageList = (id) =>{
        deleteStage({id:id}).then(res => {
            if(res.code === 0){
                removeNodeInTree(stageList, id)
                setStageList([...stageList])
            }
        })

    }

    const goStageDetail = (id) => {
        props.history.push(`/project/${projectId}/stageDetail/${id}/workitem`)
    }

    const showEditStage = (stageId) => {
        setStageId(stageId)
        setShowStageEditModal(true)
    }

    const columns = [
        {
            title: "迭代名称",
            dataIndex: "stageName",
            key: "stageName",
            width: "25%",
            className: "stage-first-col",
            render: (text, record) => (
                <div className="stage-title stage-first-col" onClick={() => goStageDetail(record.id, text)}>

                    <ColorIcon name={text} className="icon-32" color={record.color} />
                    <span className="stage-name" onClick={() => goStageDetail(record.id, text)}>{text}</span>
                </div>
            ),
        },
        {
            title: "计划日期",
            dataIndex: "data",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <span>{record.startTime?.slice(0, 10)} ~ {record.endTime?.slice(0, 10)}</span>,
        },
        // {
        //     title: "事项",
        //     dataIndex: "workNumber",
        //     key: "workNumber",
        //     align: "left"
        // },
        {
            title: "状态",
            dataIndex: ["stageState", "name"],
            key: "stageState",
            align: "left",
            render: (text, record) => <div className={`stage-status ${setStatuStyle(record.status)}`}>
                {text === "2" ? "已完成" : text === "1" ? "进行中" : "未开始"}
            </div>
        },
        {
            title: "进度",
            dataIndex: "progress",
            key: "progress",
            align: "left",
            render: (text, record) => (
                <>
                    <CircleProgress
                        percent={
                            text
                        }
                    />
                </>
            )
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record, index) => (
                <Space size="middle">
                    <svg className="svg-icon" aria-hidden="true" onClick={() => showEditStage(record.id)}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <DeleteModal deleteFunction={deleteStageList} id={record.id} content={"确定删除当前阶段以及所有下级阶段和事项?"}/>
                </Space>

            ),
        },
    ];

    return (
        <Provider {...store}>
            <Row style={{ height: "100%", overflowY: "auto" }}>
                <Col sm={24} md={24} lg={24} xl={{span: "22", offset: "1"}} xxl={{span: "18", offset: "3"}}>
                    <div className="stage" ref = {stageRef}>
                        <Breadcumb
                            firstText="阶段"
                        ></Breadcumb>
                        <div className="stage-content" >
                            <div className="stage-action">
                                <InputSearch
                                    placeholder="搜索阶段"
                                    allowClear
                                    style={{ width: 190 }}
                                    onChange={onSearch}
                                />

                                <div className="stage-action-right">
                                    <div className="stage-view">
                                        <div className={`stage-view-item stage-view-tile ${viewType === "tile" ? "stage-view-select" : ""}`} onClick={() => setViewType("tile")}>平铺</div>
                                        <div className={`stage-view-item stage-view-tree ${viewType === "tree" ? "stage-view-select" : ""}`} onClick={() => setViewType("tree")}>树状</div>
                                    </div>

                                    <Button type="primary" onClick={() => addStage()}>
                                        添加阶段
                                    </Button>
                                </div>
                            </div>
                            <div className="stage-table">
                                <Table
                                    scroll={{
                                        x: "100%"
                                    }}
                                    columns={columns}
                                    dataSource={stageList}
                                    rowKey={(record) => record.id}
                                    showSorterTooltip={false}
                                    loading={loading}
                                    // rowClassName={(record, index) => record.id === workId ? "work-table-select" : ""}
                                    pagination={{
                                        total: total,
                                        pageSize: stageCondition.pageParam.pageSize,
                                        current: stageCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        showTotal: () => `共${total}条`
                                    }}
                                    // onChange={(pagination, filters, sorter, extra) => sorterTable(pagination, filters, sorter, extra)}
                                    expandable={
                                        viewType === "tree" && {
                                            expandIcon: ({expanded, onExpand, record}) => (
                                                record.children && record.children.length > 0 ? expanded ?
                                                        <svg className="icon-10" aria-hidden="true"
                                                             onClick={e => onExpand(record, e)}>
                                                            <use xlinkHref="#icon-workDown"></use>
                                                        </svg> :
                                                        <svg className="icon-10" aria-hidden="true"
                                                             onClick={e => onExpand(record, e)}>
                                                            <use xlinkHref="#icon-workRight"></use>
                                                        </svg>
                                                    :
                                                    <>
                                                        <svg className="icon-10">

                                                        </svg>
                                                    </>
                                            )
                                        }
                                    }
                                />
                            </div>
                            <StageAddModal
                                showStageAddMoal={showStageAddMoal}
                                setShowStageAddModal={setShowStageAddModal}
                                parentId={parentId}
                                addChild={addChild}
                            />
                            <StageEditModal
                                showStageEditModal={showStageEditModal}
                                setShowStageEditModal={setShowStageEditModal}
                                stageId={stageId}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Provider>

    );
}

export default withRouter(observer(StageList));