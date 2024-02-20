import React, { useEffect, useRef, useState } from "react";
import "./WorkDetailVersionSelect.scss"
const WorkDetailVersionSelect = (props) => {
    const { selectList, version, setHoverFieldName, hoverFieldName, workId, workStore, workStatusCode } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    
    const { findWorkVersionList, editWork } = workStore;
    const dropdownRef = useRef()
    const [selectVersion, setSelectVersion] = useState(version);
    const [relationVersionList, setRelationVersionList] = useState()
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }

    }, [showDropdown])

    useEffect(() => {
        getWorkVersionList();
        return null;
    }, [])

    const getWorkVersionList = () => {
        findWorkVersionList(workId).then(res => {
            if (res.code === 0) {
                setRelationVersionList(res.data)
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
            console.log(showMoreDropdown)
            // setHoverFieldName("666666")
            console.log(hoverFieldName)
        }
    }
    const showMore = (e) => {
        e.stopPropagation();
        setShowMoreDropdown(true);
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
        setSelectVersion(item)
        const params = {
            id: workId,
            updateField: "projectVersion",
            projectVersion: {
                id: item ? item.id : "nullstring"
            }
        }
        editWork(params).then(res => {
            if (res.code === 0) {
                // setWorkInfo({ ...workInfo, ...changedValues })
                setSelectVersion(item)
                getWorkVersionList()
                setShowDropdown(false)
            }
        })
        // updateSingle(data)
    }
    return (
        <div className="work-detail-version-select" ref={dropdownRef}>
            <div className={`select-input ${showDropdown ? "select-input-focus" : ""} ? `} onClick={(e) => showSelect(e)}>
                <div>{selectVersion?.name ? selectVersion?.name : "无"}

                </div>
                {
                    showDropdown && selectVersion ?
                        <div className="select-close" onClick={() => updateWork(null)}>
                            <svg className="select-close-icon" aria-hidden="true">
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                        :
                        <>
                            {
                                relationVersionList && <div className="select-more" onClick={(e) => showMore(e)}>{relationVersionList?.length}</div>
                            }
                        </>
                }
            </div>
            {
                showDropdown && <div className="select-dropdown">
                    {
                        selectList.filter(item => item.versionState.id === "000000").length > 0 &&
                        <div className="select-group">
                            <div className="select-group-title">未开始</div>
                            <div className="select-group-option-box">
                                {
                                    selectList.filter(item => item.versionState.id === "000000").map(item => {
                                        return <div className="select-group-option" onClick={() => updateWork(item)}>{item.name}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                    {
                        selectList.filter(item => item.versionState.id === "111111").length > 0 &&
                        <div className="select-group">
                            <div className="select-group-title">进行中</div>
                            <div className="select-group-option-box">
                                {
                                    selectList.filter(item => item.versionState.id === "111111").map(item => {
                                        return <div className="select-group-option" onClick={() => updateWork(item)}>{item.name}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            }
            {
                showMoreDropdown && relationVersionList && relationVersionList.length > 0 && <div className="more-dropdown">
                    <div className="more-dropdown-title">关联过的版本</div>
                    {
                        relationVersionList.map(item => {
                            return <div className="more-item" key = {item.id}>
                                {item.name}
                            </div>
                        })
                    }
                </div>
            }

        </div>
    )
}

export default WorkDetailVersionSelect;