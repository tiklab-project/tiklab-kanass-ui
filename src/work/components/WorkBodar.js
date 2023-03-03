import React, { useRef, useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import WorkBorderDetail from "./WorkBorderDetail";
import "./WorkBodar.scss";
import { Profile } from 'tiklab-eam-ui';

const WorkBodar = (props) => {
    const { workStore, form } = props;
    const { workBoardList, changeWorkStatus, setIndexParams,
        changeBorderList, reductionWorkBoardList, boardGroup, 
        workUserGroupBoardList, workBoardListLenght, findToNodeList,
        setWorkId, setWorkIndex, setDetailCrumbArray } = workStore;
    const [moveWorkId, setMoveWorkId] = useState("")
    const [moveStatusId, setMoveStatusId] = useState("")
    const [startBoxIndex, setStartBoxIndex] = useState("")
    const [startWorkBoxIndex, setStartWorkBoxIndex] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSameFlowBox, setIsSameFlowBox] = useState()
    const modelRef = useRef()


    // 拖放效果
    const moveWorkItem = () => {
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";

    }

    const findStatusList = (stateId) => {
        let params = {
            nodeId: stateId
        }
        findToNodeList(params).then(res => {
            if (res.code === 0) {
                // console.log(res.data)
                let list = []
                res.data && res.data.length > 0 && res.data.map(item => {
                    list.push(item.id)
                })
                setIsSameFlowBox(list)
                console.log(list)
            }
        })
    }


    const moveStart = (workId, statuId, index, workIndex) => {
        // event.preventDefault();
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
        // 被拖拽盒子的起始id
        setMoveStatusId(statuId)
        setMoveWorkId(workId)

        //获取被拖拽盒子的index
        setStartBoxIndex(index)
        setStartWorkBoxIndex(workIndex)

        findStatusList(statuId)

    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeStatus = (targetStatusId, index) => {
        event.preventDefault();
        const value = {
            workStatus: targetStatusId,
            id: moveWorkId
        }
        if (targetStatusId !== moveStatusId) {
            //改变事件状态 
            let boardList = JSON.parse(JSON.stringify(workBoardList));
            console.log(startBoxIndex, startWorkBoxIndex, index, targetStatusId)
            changeBorderList(startBoxIndex, startWorkBoxIndex, index, targetStatusId)
            changeWorkStatus(value).then((res) => {
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
        // 为了删除事项后显示的事项详情定位
        setIndexParams(index, statusid)
        setWorkIndex(index)
        setWorkId(workItem.id)
        setIsModalVisible(true)
        setDetailCrumbArray([{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
        // modelRef.current.showDetail(id, index, title)
    }


    return (
        <div className="work-bodar">
            <div className="work-bodar-list">
                {
                    boardGroup === "nogroup" && workBoardList && workBoardList.map((item, index) => {
                        return <div className={`work-bodar-box`}
                            onDrop={() => changeStatus(item.state.id, index)}
                            onDragOver={dragover}
                            id={`targetBox${index}`}
                            key={item.state.id}
                            style={{ height: `${workBoardListLenght * 90 + 130}px` }}
                        >
                            <div className="work-bodar-title">
                                <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.length} 个事项</span></div>
                            </div>

                            {
                                isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1 ?
                                    <div className={`${(isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1) ? "work-bodar-box-border" : ""}`}>
                                        {/* dddd */}
                                    </div>
                                    :
                                    <div >

                                        {
                                            item.workItemList.length > 0 && item.workItemList.map((workItem, workIndex) => {
                                                return <div
                                                    className={`work-bodar-item ${moveWorkId === workItem.id ? "work-bodar-item-move" : ""}`}
                                                    key={workItem.id}
                                                    onDrag={() => moveWorkItem()}
                                                    draggable={"true"}
                                                    onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex)}
                                                >
                                                    <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                        <div className="work-item-title-left" >
                                                            {
                                                                workItem.workType.iconUrl ?
                                                                    <img
                                                                        src={'/images/' + workItem.workType.iconUrl}
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
                                                        <Profile userInfo={workItem.user} />
                                                    </div>

                                                </div>
                                            })
                                        }
                                    </div>
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
                                        onDrop={() => changeStatus(workList.state.id, index)}
                                        onDragOver={dragover}
                                        id={`targetBox${index}`}
                                        key={workList.state.id}
                                    // style={{ height: `${item.length * 83 + 60}px` }}
                                    >
                                        <div className="work-bodar-title">
                                            <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.length} 个事项</span></div>
                                        </div>
                                        {
                                            workList.workItemList.length > 0 && workList.workItemList.map((workItem, workIndex) => {
                                                return <div
                                                    className="work-bodar-item"
                                                    key={workItem.id}
                                                    onDrag={() => moveWorkItem()}
                                                    draggable="true"
                                                    onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex)}
                                                >
                                                    <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                        <div className="work-item-title-left" >
                                                            {
                                                                workItem.workType.iconUrl ?
                                                                    <img
                                                                        src={'/images/' + workItem.workType.iconUrl}
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
                                                        <Profile userInfo={workItem.user} />
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
                {...props}
            />
        </div>
    )
}
export default inject("workStore")(observer(WorkBodar));