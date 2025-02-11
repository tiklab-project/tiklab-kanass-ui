/*
 * @Descripttion: 看板事项页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 13:16:59
 */
import React, { useRef, useEffect, useState, Fragment } from 'react';
import WorkDetailDrawer from "./WorkDetailDrawer";
import "./WorkBodar.scss";
import { withRouter } from "react-router";
import UserIcon from '../../common/UserIcon/UserIcon';
import { getUser } from 'tiklab-core-ui';
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import { Provider, observer } from "mobx-react";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { Row, Col, Spin, Empty } from "antd";
import { finWorkList } from "./WorkGetList"
import ImgComponent from '../../common/imgComponent/ImgComponent';


const WorkBodar = (props) => {
    const { workBoardList, editWork, setIndexParams, changeBorderList, reductionWorkBoardList, boardGroup,
        workUserGroupBoardList, findTransitionList,
        setWorkId, setWorkIndex, createRecent, setWorkShowType, findChangePageWorkBoardList,
        workBoardCurrentPage, workShowType, getWorkBoardList, deleteWorkItem, workId } = WorkStore;
    const [moveWorkId, setMoveWorkId] = useState("")
    const [moveStatusId, setMoveStatusId] = useState("")
    const [startBoxIndex, setStartBoxIndex] = useState("")
    const [startWorkBoxIndex, setStartWorkBoxIndex] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transitionList, setTransitionList] = useState()
    const [isSameFlowBox, setIsSameFlowBox] = useState()
    const modelRef = useRef()
    const [flowId, setFlowId] = useState()
    const project = JSON.parse(localStorage.getItem("project"));
    const userId = getUser().userId;
    const path = props.match.path;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const stageId = props.match.params.stage ? props.match.params.stage : null;
    const [loading, setLoading] = useState(true)

    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    // 项目id
    const projectId = props.match.params.id;

    useEffect(async () => {
        setWorkShowType("bodar")
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            stageId: stageId
        }
        setLoading(true)
        await finWorkList(path, WorkStore, params);
        setLoading(false)
        return;
    }, [])

    // 拖放效果
    const moveWorkItem = () => {
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
    }

    /**
     * 查找能够被放置的状态id
     * @param {事项id} workId 
     * @param {状态id} stateId 
     * @param {流程id} flowId 
     */
    const findStatusList = (workId, stateId, flowId) => {
        let params = {
            domainId: workId,
            fromNodeId: stateId,
            flowId: flowId,
            userId: userId
        }
        findTransitionList(params).then(res => {
            if (res.code === 0) {
                setTransitionList(res.data)
                let list = []
                res.data && res.data.length > 0 && res.data.map(item => {
                    list.push(item.toNode.id)
                })
                setIsSameFlowBox(list)

            }
        })
    }

    // 开始拖动
    const moveStart = (workId, statuId, index, workIndex, flowId) => {
        // event.preventDefault();
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
        // 被拖拽盒子的起始id
        setMoveStatusId(statuId)
        setMoveWorkId(workId)

        //获取被拖拽盒子的index
        setStartBoxIndex(index)
        setStartWorkBoxIndex(workIndex)

        // 查找能够被放置的状态id
        findStatusList(workId, statuId, flowId)
        setFlowId(flowId)

    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    /**
     * 
     * @param {目标状态id} targetStatusId 
     * @param {目标状态所处的索引} index 
     */
    const changeStatus = (targetStatusId, index) => {
        event.preventDefault();
        const transition = transitionList.filter(item => item.toNode.id === targetStatusId);
        const value = {
            updateField: "workStatusNode",
            workStatusNode: targetStatusId,
            id: moveWorkId,
            flowId: flowId,
            transitionId: transition[0].id,
        }
        if (targetStatusId !== moveStatusId) {
            //改变事件状态 
            let boardList = JSON.parse(JSON.stringify(workBoardList));
            // 看板视图移动位置后，列表交换
            changeBorderList(startBoxIndex, startWorkBoxIndex, index, targetStatusId);
            // 修改事项
            editWork(value).then((res) => {
                if (res.code !== 0) {
                    // 若调用接口失败，则还原
                    reductionWorkBoardList(boardList)
                }
            })
        }

        // 被拖拽盒子的起始id
        setMoveStatusId("")
        setMoveWorkId("")

        //获取被拖拽盒子的index
        setStartBoxIndex("")
        setStartWorkBoxIndex("")
        setIsSameFlowBox([])
    }

    // 点击打开详情弹窗
    const showModal = (workItem, index, statusid) => {
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: workItem.workTypeSys.iconUrl
        }
        // 创建最近查看的事项
        createRecent(params)

        setIndexParams(index, statusid)
        setWorkIndex(index)
        setWorkId(workItem.id)

        const pathname = props.match.url;;
        props.history.replace(`${pathname}/${workItem.id}`)
        setIsModalVisible(true)
        // 设置事项详情的顶部面包屑
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])

    }

    /**
     * 翻页
     * @param {状态信息} item 
     * @param {状态索引} index 
     */
    const changePage = (item, index) => {
        const data = {
            index: index,
            workStatusId: item.state.id,
            pageParam: {
                pageSize: 20,
                currentPage: workBoardCurrentPage[index] + 1
            }
        }
        findChangePageWorkBoardList(data)
    }

    /**
     * 删除事项
     * @param {删除事项接口} deleteWorkItem 
     */
    const deleteWork = (deleteWorkItem) => {
        deleteWorkItem(workId).then(() => {
            if (workShowType === "bodar") {
                getWorkBoardList()
            }
        })
    }

    /**
     * 删除事项，关闭详情弹窗
     */
    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem)
        setIsModalVisible(false)
    }


    /**
     * 取消拖拽
     */
    const cancelDrag = () => {
        setIsSameFlowBox([])
        setMoveWorkId(null)

    }
    return (
        <Provider {...store}>
            <div className="work-bordar">
                <Row style={{ background: "#fff" }}>
                    <Col className="work-col" lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                        <div className="work-bodar-filter" style={{ background: "#fff" }}>
                            <WorkTableHead />
                            <WorkTableFilter />
                        </div>
                    </Col>
                </Row>
                <div className={`work-bodar-content ${loading ? "work-bodar-content-spin" : ""}`}>
                    <Spin spinning={loading} tip="加载中">
                        <div className="work-bodar-flex">
                            <div className="work-bodar-list">

                                {
                                    boardGroup === "nogroup" && workBoardList && workBoardList.map((item, index) => {
                                        if (item.state) {
                                            return <div className={`work-bodar-box`}

                                                onDragOver={dragover}
                                                id={`targetBox${index}`}
                                                key={item.state.id}
                                            >
                                                <div className="work-bodar-title">
                                                    <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.totalRecord} 个事项</span></div>
                                                </div>
                                                {
                                                    isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1 ?
                                                        <div
                                                            className={`${(isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1) ? "work-bodar-box-border" : ""}`}
                                                            onDrop={() => changeStatus(item.state.id, index)}
                                                        >
                                                        </div>
                                                        :
                                                        <>
                                                            <div className="work-border-box-list" onDrop={() => cancelDrag()}>
                                                                {
                                                                    item.workItemList.dataList.length > 0 ? item.workItemList.dataList.map((workItem, workIndex) => {
                                                                        return <div
                                                                            className={`work-bodar-item ${moveWorkId === workItem.id ? "work-bodar-item-move" : ""}`}
                                                                            key={workItem.id}
                                                                            onDrag={() => moveWorkItem()}
                                                                            draggable={"true"}
                                                                            onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                                        >
                                                                            <ImgComponent
                                                                                src={workItem.workTypeSys?.iconUrl}
                                                                                alt=""
                                                                                className="icon-24"
                                                                            />
                                                                            <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                                                <div>{workItem.code}</div>
                                                                                <div className="work-item-name">
                                                                                    {workItem.title}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    })
                                                                        :
                                                                        <>
                                                                            {
                                                                                !loading && <Empty description="暂无事项" />
                                                                            }
                                                                        </>

                                                                }
                                                                {
                                                                    workBoardCurrentPage.length > 0 && item.workItemList.totalPage > 1 &&
                                                                    workBoardCurrentPage[index] < item.workItemList.totalPage &&
                                                                    <div className="change-page" onClick={() => changePage(item, index)}>加载更多</div>
                                                                }
                                                            </div>

                                                        </>

                                                }
                                            </div>
                                        }

                                    })
                                }

                            </div>

                            {
                                boardGroup !== "nogroup" && workUserGroupBoardList && workUserGroupBoardList.map((item, index) => {
                                    return <div style={{ overflow: "auto", height: "85vh" }}>
                                        <div className="work-bodar-name">{item.user.name}</div>
                                        <div className="work-bodar">
                                            {
                                                item.workBoardList && item.workBoardList.map(workList => {
                                                    return <div className="work-bodar-box"
                                                        onDrop={() => changeStatus(workList.state.id, index)}
                                                        onDragOver={dragover}
                                                        id={`targetBox${index}`}
                                                        key={workList.state.id}
                                                    // style={{ height: `${item.length * 83 + 60}px` }}
                                                    >
                                                        <div className="work-bodar-title">
                                                            <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.totalRecord} 个事项</span></div>
                                                        </div>
                                                        {
                                                            workList.workItemList.length > 0 && workList.workItemList.map((workItem, workIndex) => {
                                                                return <div
                                                                    className="work-bodar-item"
                                                                    key={workItem.id}
                                                                    onDrag={() => moveWorkItem()}
                                                                    draggable="true"
                                                                    onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                                >
                                                                    <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                                        <div className="work-item-title-left" >
                                                                            <ImgComponent
                                                                                src={workItem.workTypeSys?.iconUrl}
                                                                                alt=""
                                                                                className="svg-icon"

                                                                            />
                                                                            {workItem.title}
                                                                        </div>
                                                                        <div>
                                                                            <span >{workItem.code}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="work-item-id"
                                                                        onClick={() => showModal(workItem, workIndex, index)}
                                                                    >
                                                                        <UserIcon userInfo={workItem.user} name={workItem.user?.name} />
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                                )
                            }
                            <WorkDetailDrawer
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                modelRef={modelRef}
                                showPage={true}
                                delectCurrentWorkItem={delectCurrentWorkItem}
                                {...props}
                            />

                        </div>
                    </Spin>

                </div>

            </div>

        </Provider>

    )
}
export default withRouter(observer(WorkBodar));