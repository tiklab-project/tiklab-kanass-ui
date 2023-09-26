
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
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";
const ProjectChangeModal = (props) => {
    const { isShowText, searchpro, project, projectStore } = props;
    const { findMyAllProjectList, allProlist } = projectStore;
    const [changeProjectList, setChangeProjectList] = useState([]);
    //  是否显示弹窗
    const [showMenu, setShowMenu] = useState(false);
    // 选择要切换的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗的ref
    const modelRef = useRef()
    // 点击按钮的ref
    const setButton = useRef()
    const tenant = getUser().tenant;
    const { t } = useTranslation();

    /**
     * 显示菜单
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        findMyAllProjectList().then(res => {
            if (res.code === 0) {
                if (res.data.length > 5) {
                    setChangeProjectList(res.data.slice(0, 6))
                } else {
                    setChangeProjectList(res.data)
                }

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
                props.history.push(`/index/projectDetail/${id}/work/table`)
                localStorage.setItem("projectId", id);
                // // 重置事项id
                // setWorkType(null)
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
                                    src={version === "cloud" ?
                                        (upload_url + project?.iconUrl + "?tenant=" + tenant)
                                        :
                                        (upload_url + project?.iconUrl)
                                    }
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
                                project?.iconUrl ? <Fragment>
                                    {
                                        version === "cloud" ? <img
                                            src={(upload_url + project?.iconUrl + "?tenant=" + tenant)}
                                            title={project?.projectName} alt=""
                                            className="list-img"
                                            style={{ marginRight: "0px" }}
                                        />
                                            :
                                            <img
                                                src={(upload_url + project?.iconUrl)}
                                                title={project?.projectName} alt=""
                                                className="list-img"
                                                style={{ marginRight: "0px" }}
                                            />
                                    }

                                </Fragment>
                                    :
                                    <img
                                        src={('images/project1.png')}
                                        className="list-img"
                                        title={project?.projectName}
                                        style={{ marginRight: "0px" }}
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
                className={`change-project-box ${showMenu ? "modal-show" : "modal-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-project-head">切换项目</div>
                {
                    changeProjectList && changeProjectList.map((item) => {
                        if (item.id !== project?.id) {
                            return <div className={`change-project-name ${item.id === selectProject ? "change-project-selectName" : ""}`}
                                onClick={() => selectProjectId(item.id, item.projectType.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}
                            >
                                {
                                    item.iconUrl ?
                                        <img
                                            src={version === "cloud" ?
                                                (upload_url + item.iconUrl + "?tenant=" + tenant)
                                                :
                                                (upload_url + item.iconUrl)
                                            }
                                            className="img-icon-right"
                                            title={item.projectName}
                                            alt=""
                                        />
                                        :
                                        <img
                                            className="img-icon-right"
                                            src={('/images/project1.png')}
                                            title={item.projectName}
                                            alt=""
                                        />
                                }
                                {item.projectName}
                            </div>
                        }

                    })
                }
                {
                    allProlist.length > 0 && <div className="change-project-more" onClick={() => props.history.push("/index/project")}>查看更多</div>
                }

            </div>
        </div>
    )
}
export default withRouter(inject('projectStore')(observer(ProjectChangeModal)));