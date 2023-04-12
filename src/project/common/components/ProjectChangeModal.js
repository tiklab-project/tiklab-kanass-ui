
/*
 * @Descripttion: 项目切换菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useRef, useState } from "react";
import "./ProjectChangeModal.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";

const ProjectChangeModal = (props) => {
    const { isShowText, prolist, searchpro, setWorkType, project } = props;
    //  是否显示弹窗
    const [showMenu, setShowMenu] = useState(false);
    // 选择要切换的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗的ref
    const modelRef = useRef()
    // 点击按钮的ref
    const setButton = useRef()
    const { t } = useTranslation();

    /**
     * 显示菜单
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
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
                console.log(data.data)
                if (data.data.projectType.type === "scrum") {
                    props.history.push(`/index/projectScrumDetail/${id}/survey`)
                }
                if (data.data.projectType.type === "nomal") {
                    props.history.push(`/index/projectNomalDetail/${id}/survey`)
                }
                localStorage.setItem("projectId", id);
                // 重置事项id
                setWorkType(null)
                // 关闭切换弹窗
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
                        {
                            project?.iconUrl ?
                                <img 
                                    src={('/images/' + project?.iconUrl)}
                                    className="list-img"
                                    alt="" 
                                />
                                :
                                <img 
                                    src={('/images/project1.png')} 
                                    className="list-img"
                                    alt=""
                                />
                        }

                        <div className={`project-text `} >
                            <div>
                                {project?.projectName}
                            </div>
                            <div className='type'>
                                {project?.projectType?.name}
                            </div>
                        </div>
                        <div className={`project-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                    :
                    <div className='project-title-icon' onClick={showMoreMenu} >
                        {
                            project?.iconUrl ?
                                <img 
                                    src={('images/' + project?.iconUrl)}
                                    title={project?.projectName} alt="" 
                                    className="list-img"
                                    style={{marginRight: "0px"}}
                                 />
                                :
                                <img 
                                    src={('images/project1.png')}
                                    className="list-img"
                                    title={project?.projectName} 
                                    style={{marginRight: "0px"}}
                                    alt=""
                                />
                        }
                        <div className={`project-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                }
            </div>

            <div
                className={`change-project-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-project-head">切换项目</div>
                {
                    prolist && prolist.map((item) => {
                        return <div className={`change-project-name ${item.id === selectProject ? "change-project-selectName" : ""}`}
                            onClick={() => selectProjectId(item.id, item.projectType.id)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}
                        >
                            {
                                item.iconUrl ?
                                    <img
                                        src={('/images/' + item.iconUrl)}
                                        className="img-icon"
                                        title={item.projectName}
                                        alt=""
                                    />
                                    :
                                    <img
                                        className="img-icon"
                                        src={('/images/project1.png')}
                                        title={item.projectName}
                                        alt=""
                                    />
                            }
                            {item.projectName}
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(ProjectChangeModal);