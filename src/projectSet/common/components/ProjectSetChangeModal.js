/*
 * @Descripttion: 项目集切换弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:22:59
 */
import React, { useEffect, useRef, useState } from "react";
import "./ProjectSetChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { Tooltip } from "antd";

const ProjectSetChangeModal = (props) => {
    const { projectSetStore, isShowText, theme } = props;
    const { findProjectSetSortRecentTime, findProjectSet, findJoinProjectSetList } = projectSetStore;
    const [projectSetAllList, setProjectSetAllList] = useState()
    const [allProjectSetList, setFindJoinProjectSetList] = useState([])
    const projectSetId = props.match.params.projectSetId;
    // 点击显示弹窗按钮
    const setButton = useRef()
    // 弹窗的显示与不显示控制参数
    const [showMenu, setShowMenu] = useState(false);
    // 要切换到的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗
    const modelRef = useRef()
    // 项目集信息
    const [projectSet, setProjectSet] = useState(JSON.parse(localStorage.getItem("projectSet")))

    /**
     * 监听鼠标点击事件，控制弹窗的显示与不显示
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    /**
     * 获取全部项目集，用于切换
     */
    useEffect(() => {
        findJoinProjectSetList({}).then(res => {
            if (res.code === 0) {
                setFindJoinProjectSetList(res.data)
            }
        })
        findProjectSetSortRecentTime({ projectSetId: projectSet?.id }).then(res => {
            if (res.code === 0) {
                setProjectSetAllList(res.data)
            }
        })
        findProjectSet(projectSetId).then(data => {
            if (data.code === 0) {
                setProjectSet(data.data)
                localStorage.setItem("projectSet", JSON.stringify(data.data))
            }
        })
        return
    }, [])

    /**
     * 显示弹窗框，并设置弹出框的位置
     */
    const showDropDown = () => {
        setShowMenu(!showMenu)
        modelRef.current.style.left = setButton.current.clientWidth
    }

    /**
     * 关闭弹窗
     * @param {点击dom} e 
     * @returns 
     */
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
    const selectProjectSetId = (record) => {
        // 切换选中项目，获取项目详情
        findProjectSet(record.id).then(data => {
            if (data.code === 0) {
                props.history.push(`/projectSetdetail/${record.id}/survey`);
                localStorage.setItem("projectSet", JSON.stringify(record))
                location.reload();
                setShowMenu(false)
            }
        });

    }

    /**
     * 鼠标放置，改变当前列表的背景色
     * @param {项目集id} id 
     */
    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    /**
     * 鼠标离开，恢复原来背景
     */
    const handleMouseOut = () => {
        setSelectProject("")
    }

    return (
        <div className="change-projectSet">
            <div onClick={() => showDropDown()} ref={setButton}>
                {
                    isShowText ? <div className="projectSet-change-title">
                        <div className={`projectSet-icon projectSet-color-${projectSet?.color}`}>{projectSet?.name?.slice(0, 1)}</div>

                        <div className={`projectSet-text `} >
                            <div>
                                {projectSet?.name}
                            </div>
                        </div>
                        <div className={`projectSet-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <Tooltip placement="right" title={projectSet?.name}>
                            <div className="projectSet-change-icon">
                                <div className={`projectSet-icon projectSet-color-${projectSet?.color}`}>{projectSet?.name?.slice(0, 1)}</div>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg>
                            </div>
                        </Tooltip>

                }

            </div>

            <div
                className={`change-projectSet-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-projectSet-head">选择项目集</div>
                <div className={`change-projectSet-item change-projectSet-selectItem`}

                    key={projectSet?.id}

                >
                    <div className={`projectSet-icon projectSet-color-${projectSet?.color}`}>{projectSet?.name?.slice(0, 1)}</div>
                    <div className="projectSet-item-info">
                        <div className="projectSet-name">
                            {projectSet?.name}
                        </div>
                        <div className="projectSet-type">
                            {projectSet?.master?.nickname}
                        </div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    projectSetAllList && projectSetAllList.map((item) => {
                        return <div className={`change-projectSet-item ${item.id === selectProject ? "change-projectSet-selectName" : ""}`}
                            onClick={() => selectProjectSetId(item)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}

                        >
                            <div className={`projectSet-icon projectSet-color-${item.color}`}>{item.name?.slice(0, 1)}</div>
                            <div className="projectSet-item-info">
                                <div className="projectSet-name">
                                    {item.name}
                                </div>
                                <div className="projectSet-type">
                                    {item.master?.nickname}
                                </div>
                            </div>
                        </div>
                    })
                }
                {
                    allProjectSetList.length > 6 && <div className="change-projectSet-more" onClick={() => props.history.push("/projectSetList")}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("projectSetStore")(observer(ProjectSetChangeModal)));