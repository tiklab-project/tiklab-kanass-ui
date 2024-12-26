/*
 * @Descripttion: 事项详情页面的版本选择下拉框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:37:00
 */
import React, { useEffect, useRef, useState } from "react";
import "./WorkDetailVersionSelect.scss"
import { Empty, Modal } from "antd";
import Button from "../../common/button/Button";
import ProjectEmpty from "../../common/component/ProjectEmpty";
const WorkDetailVersionSelect = (props) => {
    const { selectList, version, workId, workStore, workStatusCode, disabled = false } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);

    const { findWorkVersionList, editWork, haveChildren } = workStore;
    const dropdownRef = useRef()
    const [selectVersion, setSelectVersion] = useState(version);
    const [relationVersionList, setRelationVersionList] = useState();
    const [showModal, setShowModal] = useState(false);

    /**
     * 监听鼠标事件，关闭版本选择下拉框
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }

    }, [showDropdown])

    /**
     * 获取版本列表
     */
    useEffect(() => {
        getWorkVersionList();
        return;
    }, [])

    /**
     * 获取版本列表
     */
    const getWorkVersionList = () => {
        findWorkVersionList(workId).then(res => {
            if (res.code === 0) {
                setRelationVersionList(res.data)
            }
        })
    }

    /**
     * 关闭版本选择下拉框
     */
    const closeModal = (e) => {
        if (!dropdownRef.current) {
            return;
        }
        if (!dropdownRef.current.contains(e.target) && dropdownRef.current !== e.target) {
            setShowDropdown(false)
            setShowMoreDropdown(false)
        }
    }

    /**
     * 显示更多版本
     */
    const showMore = (e) => {
        e.stopPropagation();
        setShowMoreDropdown(true);
        if (workStatusCode != "DONE") {
            setShowDropdown(false)
        } else {
            return
        }
    }

    /**
     * 显示版本选择下拉框
     */
    const showSelect = (e) => {
        e.stopPropagation();
        setShowMoreDropdown(false)
        if (!disabled) {
            setShowDropdown(true)
        }

    }

    /**
     * 更新事项的版本属性
     */
    const updateWork = (item) => {
        setSelectVersion(item)
        haveChildren({ id: workId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setShowModal(true)
                } else {
                    updateWorkItem("projectVersion", item?.id)
                }
            }
        })
    }

    /**
     * 更新事项的版本属性
     */
    const updateWorkItem = (type, versionId) => {
        let params = {
            id: workId,
            projectVersion: {
                id: versionId ? versionId : "nullstring"
            },
            updateField: type,
        }
        editWork(params).then((res) => {
            if (res.code === 0) {
                getWorkVersionList()
                setShowDropdown(false)
            }
            setShowModal(false)
        })
    }

    return (
        <>
            <div className="work-detail-version-select" ref={dropdownRef}>
                <div className={`select-input ${showDropdown ? "select-input-focus" : ""} ${disabled ? "select-input-disabled" : ""} `} onClick={(e) => showSelect(e)}>
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
                    showDropdown &&
                    <>
                        {
                            selectList.length > 0 ? <div className="select-dropdown">
                                {
                                    selectList.filter(item => item.versionState.id === "000000").length > 0 &&
                                    <div className="select-group">
                                        <div className="select-group-title">未开始</div>
                                        <div className="select-group-option-box">
                                            {
                                                selectList.filter(item => item.versionState.id === "000000").map(item => {
                                                    return <div
                                                        className="select-group-option"
                                                        onClick={() => updateWork(item)}
                                                        key={item.id}
                                                    >{item.name}</div>
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
                                                    return <div
                                                        className="select-group-option"
                                                        onClick={() => updateWork(item)}
                                                        key={item.id}
                                                    >{item.name}</div>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                                :
                                <div className="select-dropdown">
                                    <ProjectEmpty description="暂时没有迭代~" />
                                </div>
                        }
                    </>

                }
                {
                    showMoreDropdown && relationVersionList && relationVersionList.length > 0 && <div className="more-dropdown">
                        <div className="more-dropdown-title">关联过的版本</div>
                        {
                            relationVersionList.map(item => {
                                return <div className="more-item" key={item.id}>
                                    {item.name}
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
                getContainer={() => dropdownRef.current}
                footer={[
                    <div className="work-detail-version-submit-botton">
                        <Button key="back" onClick={() => setShowModal(false)}>
                            取消
                        </Button>
                        <Button key="primary" type="primary" onClick={() => updateWorkItem("projectVersions")}>
                            是
                        </Button>
                        <Button type="primary" onClick={() => updateWorkItem("projectVersion")}>
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

export default WorkDetailVersionSelect;