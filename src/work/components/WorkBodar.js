import React, { useRef, useEffect, useState, Fragment } from 'react';
import WorkBorderDetail from "./WorkBorderDetail";
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
import { Select, Row, Col } from "antd";
import { finWorkList } from "./WorkGetList"
const WorkBodar = (props) => {
    const { workBoardList, editWork, setIndexParams, changeBorderList, reductionWorkBoardList, boardGroup,
        workUserGroupBoardList, workBoardListLength, findToNodeList,
        setWorkId, setWorkIndex, createRecent, setWorkShowType, findChangePageWorkBoardList, 
        workBoardCurrentPage, setQuickFilterValue } = WorkStore;
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
    const tenant = getUser().tenant;
    const path = props.match.path;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    const projectId = props.match.params.id;
    useEffect(() => {
        setWorkShowType("bodar")
        setQuickFilterValue({
            value: "pending",
            label: "我的待办"
        })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId
        }
        finWorkList(path, WorkStore,"pending", params);
        return;
    }, [])

    // 拖放效果
    const moveWorkItem = () => {
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
    }

    const findStatusList = (stateId, flowId) => {
        let params = {
            nodeId: stateId,
            flowId: flowId
        }
        findToNodeList(params).then(res => {
            if (res.code === 0) {
                // console.log(res.data)
                setTransitionList(res.data)
                let list = []
                res.data && res.data.length > 0 && res.data.map(item => {
                    list.push(item.toNode.id)
                })
                setIsSameFlowBox(list)

            }
        })
    }


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

        findStatusList(statuId, flowId)
        setFlowId(flowId)

    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeStatus = (targetStatusId, index, item) => {
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
            changeBorderList(startBoxIndex, startWorkBoxIndex, index, targetStatusId)
            editWork(value).then((res) => {
                if (res.code !== 0) {
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
        createRecent(params)

        setIndexParams(index, statusid)
        setWorkIndex(index)
        setWorkId(workItem.id)
        setIsModalVisible(true)
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
        if (path === `/index/projectDetail/:id/workBodar`) {
            console.log(props.history)
            props.history.replace(`/index/projectDetail/${projectId}/workBodar/${workItem.id}`)
        }
        if (path === `/index/workBodar`) {
            console.log(props.history)
            props.history.replace(`/index/workBodar/${workItem.id}`)
        }
    }

    const changePage = (item, index) => {
        const data = {
            index: index,
            workStatusId: item.state.id,
            pageParam: {
                pageSize: 20,
                currentPage: item.workItemList.currentPage + 1
            }
        }
        findChangePageWorkBoardList(data)
    }

    return (
        <Provider {...store}>
            <Fragment>
                <Row>
                    <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                        <div className="work-list-col" style={{ background: "#fff" }}>
                            <WorkTableHead />
                            <WorkTableFilter />
                        </div>
                    </Col>
                </Row>
                <div className="work-bodar">
                    <div className="work-bodar-flex">
                        <div className="work-bodar-list">
                            {
                                boardGroup === "nogroup" && workBoardList && workBoardList.map((item, index) => {
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
                                                <div className={`${(isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1) ? "work-bodar-box-border" : ""}`} onDrop={() => changeStatus(item.state.id, index, item)}>

                                                </div>
                                                :
                                                <>
                                                    <div className="work-border-box-list">
                                                        {
                                                            item.workItemList.dataList.length > 0 && item.workItemList.dataList.map((workItem, workIndex) => {
                                                                return <div
                                                                    className={`work-bodar-item ${moveWorkId === workItem.id ? "work-bodar-item-move" : ""}`}
                                                                    key={workItem.id}
                                                                    onDrag={() => moveWorkItem()}
                                                                    draggable={"true"}
                                                                    onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                                >
                                                                    <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                                        {workItem.title}
                                                                    </div>

                                                                    <div className="work-item-bottom">
                                                                        <div>
                                                                            {
                                                                                workItem.workTypeSys?.iconUrl ?
                                                                                    <img
                                                                                        src={(upload_url + workItem.workTypeSys?.iconUrl)}
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
                                                                            <span >{workItem.id}</span>
                                                                        </div>
                                                                        <div className="work-item-assigner"
                                                                            onClick={() => showModal(workItem, workIndex, index)}
                                                                        >
                                                                            <span>{workItem.assigner?.nickname}</span>
                                                                            <UserIcon userInfo={workItem.assigner} name={workItem.assigner?.nickname} />
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            })
                                                        }
                                                        {
                                                            workBoardCurrentPage.length > 0 && item.workItemList.totalPage > 1 && workBoardCurrentPage[index] < item.workItemList.totalPage && <div className="change-page" onClick={() => changePage(item, index)}>加载更多</div>
                                                        }
                                                    </div>

                                                </>

                                        }
                                    </div>
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
                                                    onDrop={() => changeStatus(workList.state.id, index, workList)}
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
                                                                        {
                                                                            workItem.workTypeSys.iconUrl ?
                                                                                <img
                                                                                    src={version === "cloud" ?
                                                                                        (upload_url + workItem.workTypeSys?.iconUrl + "?tenant=" + tenant)
                                                                                        :
                                                                                        (upload_url + workItem.workTypeSys?.iconUrl)
                                                                                    }
                                                                                    alt=""
                                                                                    className="svg-icon"

                                                                                />
                                                                                :
                                                                                <img
                                                                                    src={'/images/workType2.png'}
                                                                                    alt=""
                                                                                    className="svg-icon"
                                                                                />
                                                                        }
                                                                        {workItem.title}
                                                                    </div>
                                                                    <div>
                                                                        <span >{workItem.id}</span>
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
                        <WorkBorderDetail
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                            modelRef={modelRef}
                            showPage={true}
                            {...props}
                        />
                    </div>
                </div>

            </Fragment>

        </Provider>

    )
}
export default withRouter(observer(WorkBodar));