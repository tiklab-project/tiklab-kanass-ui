
/*
 * @Descripttion: 项目切换菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useRef, useState } from "react";
import "./ProjectChangeModal.scss";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import setImageUrl from "../../../common/utils/setImageUrl";
import { Tooltip } from "antd";
const ProjectChangeModal = (props) => {
    const { isShowText, projectStore, theme } = props;
    const { findMyAllProjectList,allProlist, findProjectSortRecentTime, project, createRecent, searchpro } = projectStore;
    const [changeProjectList, setChangeProjectList] = useState([]);
    //  是否显示弹窗
    const [showMenu, setShowMenu] = useState(false);
    // 选择要切换的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗的ref
    const modelRef = useRef()
    // 点击按钮的ref
    const setButton = useRef()

    /**
     * 显示菜单
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        findMyAllProjectList({})
        findProjectSortRecentTime({projectId: project?.id}).then(res => {
            if (res.code === 0) {
                setChangeProjectList(res.data)
            }
        })
        // 设置弹窗的位置在按钮旁边
        modelRef.current.style.left = setButton.current.clientWidth
    }

    /**
    * 监听切换弹窗的显示与不显示
    */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    /**
     * 关闭弹窗
     * @param {点击的位置} e 
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
    const selectProjectId = (id, typeId) => {
        // 切换选中项目，获取项目详情
        searchpro(id).then(data => {

            if (data.code === 0) {
                localStorage.setItem("project", JSON.stringify(data.data));
                props.history.push(`/projectDetail/${id}/workTable`)
                localStorage.setItem("projectId", id);

                // 创建最近访问的信息
                const project = data.data;
                const params = {
                    name: project.projectName,
                    model: "project",
                    modelId: project.id,
                    project: { id: project.id },
                    projectType: { id: project.projectType.id },
                    iconUrl: project.iconUrl
                }
                createRecent(params)

                setShowMenu(false)
                location.reload();
            }
        });
        // 讲当前项目id存入localStorage
    }

    /**
     * 鼠标放到项目上，项目列表变色
     * @param {项目id} id 
     */
    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    /**
     * 鼠标移走，项目列表恢复原来颜色
     * @param {项目id} id 
     */
    const handleMouseOut = () => {
        setSelectProject("")
    }

    return (
        <div className="change-project">
            <div ref={setButton}>
                {
                    isShowText ? <div className="project-title title" onClick={showMoreMenu}>
                        <img
                            src={setImageUrl(project?.iconUrl)}
                            className="icon-24"
                            alt=""
                        />
                        <div className={`project-text `} >
                            <div className='name'>
                                {project?.projectName}
                            </div>
                            <div className='type'>
                                {project?.projectType?.name}
                            </div>
                        </div>
                        <div className={`project-toggleCollapsed`}>
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                            </svg>
                        </div>
                    </div>
                    :
                    <Tooltip placement="right" title={project?.projectName}>
                        <div className='project-title-icon' onClick={showMoreMenu} >
                            <img
                                src={setImageUrl(project?.iconUrl)}
                                title={project?.projectName}
                                // alt={project?.projectName}
                                className="icon-32"
                                style={{ marginRight: "0px" }}
                            />
                            <div className={`project-toggleCollapsed`}>
                                <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg>
                            </div>
                        </div>
                    </Tooltip>
                }
            </div>

            <div
                className={`change-project-box ${showMenu ? "modal-show" : "modal-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-project-head">选择项目</div>
                <div className={`change-project-item change-project-selectItem`}
                    onClick={() => selectProjectId(project.id, project.projectType.id)}
                    key={project.id}
                    onMouseOver={() => handleMouseOver(project.id)}
                    onMouseOut={handleMouseOut}
                >
                    <img
                        src={setImageUrl(project.iconUrl)}
                        className="icon-24"
                        title={project.projectName}
                        alt=""
                    />
                    <div className="project-item-info">
                        <div className="project-name">
                            {project.projectName}
                        </div>
                        <div className="project-type">
                            {project.projectType.name}
                        </div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    changeProjectList && changeProjectList.map((item) => {
                        if (item.id !== project?.id) {
                            return <div className={`change-project-item`}
                                onClick={() => selectProjectId(item.id, item.projectType.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}
                            >
                                <img
                                    src={setImageUrl(item.iconUrl)}
                                    className="icon-24"
                                    title={item.projectName}
                                    alt=""
                                />
                                <div className="project-item-info">
                                    <div className="project-name">
                                        {item.projectName}
                                    </div>
                                    <div className="project-type">
                                        {item.projectType.name}
                                    </div>
                                </div>

                            </div>
                        }
                    })
                }
                {
                    allProlist.length > 6 && <div className="change-project-more" onClick={() => props.history.push("/index/project")}>查看更多</div>
                }
            </div>
        </div >
    )
}
export default withRouter(inject('projectStore')(observer(ProjectChangeModal)));