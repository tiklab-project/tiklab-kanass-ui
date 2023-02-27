import React, { useEffect, useRef, useState } from "react";
import "./MoreMenuModal.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const MoreMenuModel = (props) => {
    const { isShowText, prolist, searchpro, setWorkType, project } = props;
    const projectId = props.match.params.id;
    const path = props.location.pathname.split("/")[4];
    const type = props.location.pathname.split("/")[2];
    const [showMenu, setShowMenu] = useState(false);
    const [selectProject, setSelectProject] = useState(false)

    const modelRef = useRef()
    const setButton = useRef()
    const { t } = useTranslation();
    const paths = ["statistics"]

    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        modelRef.current.style.left = setButton.current.clientWidth
    }

    const moreMenu = [
        {
            title: `${t('statistic')}`,
            icon: 'statisticslog',
            url: `/index/${type}/${projectId}/statistics/workItem`,
            key: "statistics",
            encoded: "Statistic",
        }
    ]

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

    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    const handleMouseOut = () => {
        setSelectProject("")
    }

    const selectMenu = (key) => {
        props.history.push(key)
        setShowMenu(false)
    }

    return (
        <div className="change-project">
            {
                isShowText ? <div className={`project-menu-submenu ${paths.indexOf(path) !== -1 ? "project-menu-select" : ""}`}
                    onClick={() => showMoreMenu()}
                    ref={setButton}
                >
                    <svg className="menu-icon" aria-hidden="true">
                        <use xlinkHref={`#icon-more`}></use>
                    </svg>
                    <span>
                        更多
                    </span>
                </div>
                    :
                    <div ref={setButton} className={`project-menu-submenu-icon ${paths.indexOf(path) !== -1 ? "project-menu-select" : ""}`} onClick={() => showMoreMenu()}>
                        <svg aria-hidden="true" style={{width: "28px", height: "28px"}}>
                            <use xlinkHref={`#icon-more`}></use>
                        </svg>
                        {/* <span>
                            更多
                        </span> */}
                    </div>
            }


            <div
                className={`change-project-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                {/* <div className="change-project-head">更多</div> */}
                {
                    moreMenu && moreMenu.map((item,index) => {
                        return <div className={`project-menu-submenu`}
                            key={index}
                            onClick={() => selectMenu(item.url)}
                        >
                            <svg className="menu-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                            <span>
                                {item.title}
                            </span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("projectDetailStore")(observer(MoreMenuModel)));