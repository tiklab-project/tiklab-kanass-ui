import React, { useEffect, useRef, useState } from "react";
import "./StageChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { Tooltip } from "antd";

const StageChangeModal = (props) => {
    const { isShowText, stageDetailStore } = props;
    const { findStageList, findStage, stageList, stage } = stageDetailStore;
    const [showMenu, setShowMenu] = useState(false);
    const [selectStage, setSelectStage] = useState(false)

    const modelRef = useRef()
    const setButton = useRef()
    const stageId = props.match.params.stage;
    const projectId = props.match.params.id;
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        setSelectStage(stageId)
        modelRef.current.style.left = setButton.current.clientWidth
    }
    const [showStageList, setShowStageList] = useState()
    useEffect(() => {
        findStageList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                let list = res.data;
                list = list.filter(item => item.id !== stageId)
                if (list.length > 5) {
                    setShowStageList(res.data.slice(0, 6))
                } else {
                    setShowStageList(list)
                }

            }
        })
        return;
    }, [stageId])

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    /**
     * 切换项目
     * @param {id} id 
     */
    const selectStageId = (id) => {
        // 切换选中项目，获取项目详情
        findStage({ id: id }).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/stagedetail/${id}/workTable`)
                localStorage.setItem("stageId", id);
                setShowMenu(false)
            }
        });
        // 讲当前项目id存入localStorage
    }

    const handleMouseOver = (id) => {
        setSelectStage(id)
    }

    const handleMouseOut = () => {
        setSelectStage("")
    }

    const status = ["未完成", "进行中", "已完成"]

    return (
        <div className="change-stage">
            <div ref={setButton}>
                {
                    isShowText ? <div className="stage-title title" onClick={showMoreMenu}>
                        <img
                            src={('/images/stage.png')}
                            className="icon-32"
                            alt=""
                        />

                        <div className={`stage-text `} >
                            <div>
                                {stage?.stageName}
                            </div>
                        </div>
                        <div className={`stage-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <Tooltip placement="right" title={stage?.stageName}>
                            <div className='stage-title-icon' onClick={showMoreMenu} >
                                <img
                                    src={('/images/stage.png')}
                                    className="icon-32"
                                    
                                    alt=""
                                />
                                <div className={`stage-toggleCollapsed`}>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-down"></use>
                                    </svg>
                                </div>
                            </div>
                        </Tooltip>

                }
            </div>

            <div
                className={`change-stage-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-stage-head">切换计划</div>
                <div className={`change-stage-item change-stage-selectName`}
                    key={stageId}

                >
                    <img
                        className="icon-32"
                        src={('images/stage.png')}
                        title={stage?.stageName}
                        alt=""
                    />
                    <div className="change-stage-info">
                        <div className="change-stage-name">{stage?.stageName}</div>
                        <div className="change-stage-state">{status[stage?.status]}</div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    showStageList && showStageList.map((item) => {
                        if (item.id !== stageId) {
                            return <div className={`change-stage-item ${item.id === selectStage ? "change-stage-selectName" : ""}`}
                                onClick={() => selectStageId(item.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}

                            >
                                <img
                                    className="icon-32"
                                    src={('images/stage.png')}
                                    title={item.stageName}
                                    alt=""
                                />
                                <div className="change-stage-info">
                                    <div className="change-stage-name">{item.stageName}</div>
                                    <div className="change-stage-state">{status[item.status]}</div>
                                </div>
                            </div>
                        }

                    })
                }
                {
                    stageList.length > 6 &&
                    <div className="change-stage-more" onClick={() => props.history.push(`/projectDetail/${projectId}/stage`)}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("stageDetailStore")(observer(StageChangeModal)));