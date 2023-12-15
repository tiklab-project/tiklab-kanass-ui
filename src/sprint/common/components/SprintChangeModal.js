import React, { useEffect, useRef, useState } from "react";
import "./SprintChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const SprintChangeModal = (props) => {
    // console.log(props)
    const { isShowText, sprintDetailStore } = props;
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
     * 切换项目
     * @param {id} id 
     */
    const selectSprintId = (id) => {
        // 切换选中项目，获取项目详情
        findSprint({ id: id }).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/sprintdetail/${id}/survey`)
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
                        <img
                            src={('/images/sprint.png')}
                            className="icon-32"
                            alt=""
                        />

                        <div className={`sprint-text `} >
                            <div>
                                {sprint?.sprintName}
                            </div>
                        </div>
                        <div className={`sprint-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <div className='sprint-title-icon' onClick={showMoreMenu} >
                            <img
                                src={('/images/sprint.png')}
                                className="icon-32"
                                alt=""
                            />
                            <div className={`sprint-toggleCollapsed`}>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-down"></use>
                                </svg>
                            </div>
                        </div>
                }
            </div>

            <div
                className={`change-sprint-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-sprint-head">切换迭代</div>
                <div className={`change-sprint-item change-sprint-selectName`}
                    key={sprintId}

                >
                    <img
                        className="icon-32"
                        src={('images/sprint.png')}
                        title={sprint?.sprintName}
                        alt=""
                    />
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
                                <img
                                    className="icon-32"
                                    src={('images/sprint.png')}
                                    title={item.sprintName}
                                    alt=""
                                />
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
                    <div className="change-sprint-more" onClick={() => props.history.push(`/projectDetail/${projectId}/sprint`)}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("sprintDetailStore")(observer(SprintChangeModal)));