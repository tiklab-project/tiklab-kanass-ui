import React, { useEffect, useRef, useState } from "react";
import "./SprintChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const SprintChangeModal = (props) => {
    // console.log(props)
    const { isShowText, sprintDetailStore } = props;
    const { findSprintList,findSprint, sprintList, sprint } = sprintDetailStore;
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
    useEffect(() => {
        findSprintList({projectId: projectId})
    },[])

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
        findSprint({id: id}).then(data => {
            if (data.code === 0) {
                props.history.push(`/index/${projectId}/sprintdetail/${id}/survey`)
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
                            src={('/images/project1.png')} 
                            className="list-img"
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
                            src={('/images/project1.png')} 
                            className="list-img"
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
                {
                    sprintList && sprintList.map((item) => {
                        if(item.id !== sprintId){
                            return <div className={`change-sprint-name ${item.id === selectSprint ? "change-sprint-selectName" : ""}`}
                                onClick={() => selectSprintId(item.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}

                            >
                                <img
                                    className="img-icon-right"
                                    src={('images/project1.png')}
                                    title={item.sprintName}
                                    alt=""
                                />
                                {item.sprintName}
                            </div>
                        }
                        
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("sprintDetailStore")(observer(SprintChangeModal)));