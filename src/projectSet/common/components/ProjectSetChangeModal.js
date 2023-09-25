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

const ProjectSetChangeModal = (props) => {
    const { projectSetStore, isShowText } = props;
    const { findAllProjectSet, findProjectSet } = projectSetStore;
    const [projectSetAllList, setProjectSetAllList] = useState()
    // 点击显示弹窗按钮
    const setButton = useRef()
    // 弹窗的显示与不显示控制参数
    const [showMenu, setShowMenu] = useState(false);
    // 要切换到的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗
    const modelRef = useRef()
    // 项目集信息
    const projectSet = JSON.parse(localStorage.getItem("projectSet"));

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
        findAllProjectSet().then(res => {
            setProjectSetAllList(res.data)
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
                props.history.push(`/index/projectSetdetail/${record.id}/survey`);
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
                <div  onClick={() =>showDropDown()} ref = {setButton}>
                    {
                        isShowText ? <div className="projectSet-change-title">
                           <svg className="list-img" aria-hidden="true">
                                <use xlinkHref="#icon-program"></use>
                            </svg>
                            <div className={`projectSet-text `} >
                                <div>
                                    {projectSet.name}
                                </div>
                                {/* <div className='type'>
                                    {projectType}
                                </div> */}
                            </div>
                            <div className={`projectSet-toggleCollapsed`}>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-down"></use>
                                </svg>
                            </div>
                        </div>
                        :
                        <div className="projectSet-change-icon">
                            <svg className="list-img" aria-hidden="true">
                                <use xlinkHref="#icon-program"></use>
                            </svg>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    }

                </div>

            <div
                className={`change-projectSet-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-projectSet-head">切换项目集</div>
                {
                    projectSetAllList && projectSetAllList.map((item) => {
                        return <div className={`change-projectSet-name ${item.id === selectProject ? "change-projectSet-selectName" : ""}`}
                            onClick={() => selectProjectSetId(item)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}

                        >
                            {
                                item.iconUrl ?
                                    <img
                                        src={('images/' + item.iconUrl)}
                                        className="img-icon-right"
                                        title={item.name}
                                        alt=""
                                    />
                                    :
                                    <img
                                        className="img-icon-right"
                                        src={('images/project1.png')}
                                        title={item.name}
                                        alt=""
                                    />
                            }
                            {item.name}
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("projectSetStore")(observer(ProjectSetChangeModal)));