/*
 * @Descripttion: 切换迭代弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect, useRef, useState } from "react";
import "./SprintChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { Tooltip } from "antd";
import ColorIcon from "../../../common/colorIcon/ColorIcon";

const SprintChangeModal = (props) => {
    const { isShowText, sprintDetailStore, theme } = props;
    const { findSprintList, findSprint, sprintList, sprint } = sprintDetailStore;
    const [showMenu, setShowMenu] = useState(false);
    const [selectSprint, setSelectSprint] = useState(false)

    const modelRef = useRef()
    const setButton = useRef()
    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        setSelectSprint(sprintId)
        modelRef.current.style.left = setButton.current.clientWidth
    }
    const [showSprintList, setShowSprintList] = useState()
    useEffect(() => {
        findSprintList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                let list = res.data;
                list = list.filter(item => item.id !== sprintId)
                if (list.length > 5) {
                    setShowSprintList(res.data.slice(0, 6))
                } else {
                    setShowSprintList(list)
                }

            }
        })
        return;
    }, [sprintId])

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
     * 切换迭代
     * @param {id} id 
     */
    const selectSprintId = (id) => {
        // 切换选中项目，获取项目详情
        findSprint({ id: id }).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/sprint/${id}/workitem`)
                localStorage.setItem("sprintId", id);
                setShowMenu(false)
            }
        });
        // 讲当前项目id存入localStorage
    }

    const handleMouseOver = (id) => {
        setSelectSprint(id)
    }

    const handleMouseOut = () => {
        setSelectSprint("")
    }

    return (
        <div className="change-sprint">
            <div ref={setButton}>
                {
                    isShowText ? <div className="sprint-title title" onClick={showMoreMenu}>

                        <ColorIcon name={sprint?.sprintName} className="icon-24" color={sprint?.color} />
                        <div className={`sprint-text `} >
                            <div>
                                {sprint?.sprintName}
                            </div>
                        </div>
                        <div className={`sprint-toggleCollapsed`}>
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <Tooltip placement="right" title={sprint?.sprintName}>
                            <div className='sprint-title-icon' onClick={showMoreMenu} >

                                <ColorIcon name={sprint?.sprintName} className="img-32" color={sprint?.color} />
                                {/* <div className={`sprint-toggleCollapsed`}>
                                    <svg className="icon-15" aria-hidden="true">
                                        <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                    </svg>
                                </div> */}
                            </div>
                        </Tooltip>

                }
            </div>

            <div
                className={`change-sprint-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-sprint-head">切换迭代</div>
                <div className={`change-sprint-item change-sprint-selectName`}
                    key={sprintId}

                >

                    <ColorIcon name={sprint?.sprintName} className="icon-32" color={sprint?.color} />
                    <div className="change-sprint-info">
                        <div className="change-sprint-name">{sprint?.sprintName}</div>
                        <div className="change-sprint-state">{sprint?.sprintState?.name}</div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    showSprintList && showSprintList.map((item) => {
                        if (item.id !== sprintId) {
                            return <div className={`change-sprint-item ${item.id === selectSprint ? "change-sprint-selectName" : ""}`}
                                onClick={() => selectSprintId(item.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}

                            >
                                <ColorIcon name={item.sprintName} className="icon-32" color={item.color} />
                                <div className="change-sprint-info">
                                    <div className="change-sprint-name">{item.sprintName}</div>
                                    <div className="change-sprint-state">{item.sprintState.name}</div>
                                </div>
                            </div>
                        }

                    })
                }
                {
                    sprintList.length > 6 &&
                    <div className="change-sprint-more" onClick={() => props.history.push(`/project/${projectId}/sprint`)}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("sprintDetailStore")(observer(SprintChangeModal)));