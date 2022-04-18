import React, { useRef, useEffect, useState } from 'react';
import { PlayCircleTwoTone } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import WorkDetailModal from "./workDetailModal";
import "./workBodar.scss"

const WorkBodar = (props) => {
    const { workStore } = props;
    const { workBoardList, changestate, setIndexParams,
        changeBorderList, reductionWorkBoardList, boardGroup,workUserGroupBoardList,workBoardListLenght } = workStore;
    const [moveWorkId, setMoveWorkId] = useState("")
    const [moveStatusId, setMoveStatusId] = useState("")
    const [startBoxIndex, setStartBoxIndex] = useState("")
    const [startWorkBoxIndex, setStartWorkBoxIndex] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef()
    

    // 拖放效果
    const moveWorkItem = () => {
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";

    }

    const moveStart = (workId, statuId, index, workIndex) => {
        event.preventDefault();
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";

        // 被拖拽盒子的起始id
        setMoveStatusId(statuId)
        setMoveWorkId(workId)

        //获取被拖拽盒子的index
        setStartBoxIndex(index)
        setStartWorkBoxIndex(workIndex)
    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeStatus = (targetStatusId, index) => {
        event.preventDefault();
        const value = {
            state: targetStatusId,
            id: moveWorkId
        }
        if (targetStatusId !== moveStatusId) {
            //改变事件状态 
            let boardList = JSON.parse(JSON.stringify(workBoardList));
            changeBorderList(startBoxIndex, startWorkBoxIndex, index, targetStatusId)
            changestate(value).then((res) => {
                if (res.code !== 0) {
                    reductionWorkBoardList(boardList)
                }
            })
        }
    }

    // 点击打开详情弹窗
    const showModal = (id, index, statusid, title) => {
        // 为了删除事项后显示的事项详情定位
        setIndexParams(index, statusid)
        modelRef.current.showDetail(id, index, title)
    }


    return (
        <div >
            <div className="work-bodar" style={{ overflow: "auto" }}>
                {
                    boardGroup === "nogroup" && workBoardList && workBoardList.map((item, index) => {
                        return <div className="work-bodar-box"
                            onDrop={() => changeStatus(`targetBox${index}`, item.state.id, index)}
                            onDragOver={dragover}
                            id={`targetBox${index}`}
                            key={item.state.id}
                            style={{height: `${workBoardListLenght * 83 + 60}px`}}
                        >
                            <div className="work-bodar-title">{item.state.name}</div>
                            {
                                item.workItemList.length > 0 && item.workItemList.map((workItem, workIndex) => {
                                    return <div
                                        className="work-bodar-item"
                                        key={workItem.id}
                                        onDrag={() => moveWorkItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex)}
                                    >
                                        <div className="work-bodar-id"
                                            onClick={() => showModal(workItem.id, workIndex, index, workItem.title)}
                                        >
                                            <PlayCircleTwoTone />&nbsp; <span >#{workItem.id}</span>
                                        </div>
                                        <div className="work-bodar-title">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {workItem.title}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    })
                }
                </div>
                <div  style={{ overflow: "auto",height: "85vh" }}>
                {
                    boardGroup !== "nogroup" && workUserGroupBoardList && workUserGroupBoardList.map((item,index) => {
                        return <div>
                            <div className="work-bodar-name">{item.user.name}</div>
                            <div className="work-bodar">
                            {
                                item.workBoardList && item.workBoardList.map(workList => {
                                    return <div className="work-bodar-box"
                                        onDrop={() => changeStatus(`targetBox${index}`, workList.state.id, index)}
                                        onDragOver={dragover}
                                        id={`targetBox${index}`}
                                        key={workList.state.id}
                                        style={{height: `${item.length * 83 + 60}px`}}
                                    >
                                        <div className="work-bodar-title">{workList.state.name}</div>
                                        {
                                            workList.workItemList.length > 0 && workList.workItemList.map((workItem, workIndex) => {
                                                return <div
                                                    className="work-bodar-item"
                                                    key={workItem.id}
                                                    onDrag={() => moveWorkItem()}
                                                    draggable="true"
                                                    onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex)}
                                                >
                                                    <div className="work-bodar-id"
                                                        onClick={() => showModal(workItem.id, workIndex, index, workItem.title)}
                                                    >
                                                        <PlayCircleTwoTone />&nbsp; <span >#{workItem.id}</span>
                                                    </div>
                                                    <div className="work-bodar-title">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        {workItem.title}
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
                </div>
            <WorkDetailModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                modelRef={modelRef}
                {...props}
            />
        </div>
    )
}
export default inject("workStore")(observer(WorkBodar));