import React, { useEffect, useRef, useState } from "react";
import "./WorkDetailSprintSelect.scss"
const WorkDetailSprintSelect = (props) => {
    const { selectList, sprint, setHoverFieldName, hoverFieldName, workId, workStore, workStatusCode } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const { findWorkSprintList, editWork } = workStore;
    const dropdownRef = useRef()
    const [selectSprint, setSelectSprint] = useState(sprint);
    const [relationSprintList, setRelationSprintList] = useState()
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }

    }, [showDropdown])

    useEffect(() => {
        getWorkSprintList()
        return
    }, [])

    const getWorkSprintList = () => {
        findWorkSprintList(workId).then(res => {
            if (res.code === 0) {
                setRelationSprintList(res.data)
            }
        })
    }

    const closeModal = (e) => {
        if (!dropdownRef.current) {
            return;
        }
        if (!dropdownRef.current.contains(e.target) && dropdownRef.current !== e.target) {
            setShowDropdown(false)
            setShowMoreDropdown(false)
        }
    }
    const showMore = (e) => {
        e.stopPropagation();
        setShowMoreDropdown(true)
        if(workStatusCode != "DONE"){
            setShowDropdown(false)
        }else {
            return
        }
        

    }
    const showSelect = (e) => {
        e.stopPropagation();
        setShowMoreDropdown(false)
        if(workStatusCode != "DONE"){
            
            setShowDropdown(true)
        }else {
            return
        }
        
    }

    const updateWork = (item) => {
        setSelectSprint(item)
        const params = {
            id: workId,
            updateField: "sprint",
            sprint: {
                id: item ? item.id : "nullstring"
            }
        }
        editWork(params).then(res => {
            if (res.code === 0) {
                // setWorkInfo({ ...workInfo, ...changedValues })
                setSelectSprint(item)
                getWorkSprintList()
                setShowDropdown(false)
            }
        })
        // updateSingle(data)
    }
    return (
        <div className="work-detail-sprint-select" ref={dropdownRef}>
            <div className={`select-input ${showDropdown ? "select-input-focus" : ""} ? `} onClick={(e) => showSelect(e)}>
                <div>
                    {selectSprint?.sprintName ? selectSprint?.sprintName : "无"}
                </div>
                {
                    showDropdown && selectSprint ?
                        <div className="select-close" onClick={() => updateWork(null)}>
                            <svg className="select-close-icon" aria-hidden="true">
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                        :
                        <>
                            {
                                relationSprintList && <div className="select-more" onClick={(e) => showMore(e)}>{relationSprintList.length}</div>
                            }
                        </>
                }
            </div>
            {
                showDropdown && <div className="select-dropdown">
                    {
                        selectList.filter(item => item.sprintState.id === "000000").length > 0 &&
                        <div className="select-group">
                            <div className="select-group-title">未开始</div>
                            <div className="select-group-option-box">
                                {
                                    selectList.filter(item => item.sprintState.id === "000000").map(item => {
                                        return <div className="select-group-option" onClick={() => updateWork(item)}>{item.sprintName}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                    {
                        selectList.filter(item => item.sprintState.id === "111111").length > 0 &&
                        <div className="select-group">
                            <div className="select-group-title">进行中</div>
                            <div className="select-group-option-box">
                                {
                                    selectList.filter(item => item.sprintState.id === "111111").map(item => {
                                        return <div className="select-group-option" onClick={() => updateWork(item)}>{item.sprintName}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            }
            {
                showMoreDropdown && relationSprintList && relationSprintList.length > 0 && <div className="more-dropdown">
                    <div className="more-dropdown-title">关联过的迭代</div>
                    {
                        relationSprintList.map(item => {
                            return <div className="more-item">
                                {item.sprintName}
                            </div>
                        })
                    }
                </div>
            }

        </div>
    )
}

export default WorkDetailSprintSelect;