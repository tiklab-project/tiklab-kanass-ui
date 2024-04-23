import React, { useEffect, useRef, useState } from "react";
import "./WorkDetailSprintSelect.scss"
import { Modal } from "antd";
import Button from "../../common/button/Button";
const WorkDetailSprintSelect = (props) => {
    const { selectList, sprint, setHoverFieldName, hoverFieldName, workId, workStore, workStatusCode } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const { findWorkSprintList, editWork, haveChildren } = workStore;
    const dropdownRef = useRef()
    const [selectSprint, setSelectSprint] = useState(sprint);
    const [relationSprintList, setRelationSprintList] = useState()
    const [showModal, setShowModal] = useState(false);
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
        haveChildren({ id: workId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setShowModal(true)
                } else {
                    updateWorkItem("sprint", item?.id)
                }
            }
        })
    }

  

    const updateWorkItem = (type, sprintId) => {
        let params = {
            id: workId,
            sprint: {
                id: sprintId ? sprintId : "nullstring"
            },
            updateField: type,
        }
        editWork(params).then((res) => {
            if (res.code === 0) {
                // setSelectSprint(item)
                getWorkSprintList()
                setShowDropdown(false)
            }
            setShowModal(false)
        })
    }

    return (
        <>
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
                                        return <div 
                                            className="select-group-option" 
                                            onClick={() => updateWork(item)} 
                                            key = {item.id}
                                        >{item.sprintName}</div>
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
                                        return <div className="select-group-option" onClick={() => updateWork(item)} key = {item.id}>{item.sprintName}</div>
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
                            return <div className="more-item" key = {item.id}>
                                {item.sprintName}
                            </div>
                        })
                    }
                </div>
            }

        </div>

        <Modal
                visible={showModal}
                title="是否移动下级"
                onCancel={() => setShowModal(false)}
                getContainer = {() => dropdownRef.current}
                footer={[
                    <div className="work-detail-sprint-submit-botton">
                        <Button key="back" onClick={() => setShowModal(false)}>
                            取消
                        </Button>
                        <Button key="primary" type="primary" onClick = {() => updateWorkItem("sprints")}>
                            是
                        </Button>
                        <Button type="primary" onClick = {() => updateWorkItem("sprint")}>
                            否
                        </Button>
                    </div>

                ]}
            >
                是否移动下级
            </Modal>
        </>
        
    )
}

export default WorkDetailSprintSelect;