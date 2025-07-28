import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import React, {useEffect, useRef, useState} from "react";
import {searchWorkList, setWorkDeatilInList} from "./WorkSearch";
import {getUser} from "tiklab-core-ui";
import "./WorkFilterSelect.scss"

const WorkFilterSelect = (props) =>{
    const { workStore } = props;
    // 解析store数据
    const { findStateNodeList, setSearchCondition,setQuickFilterValue, getWorkBoardList, workShowType } = workStore;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const project = JSON.parse(localStorage.getItem("project"));
    const projectType = projectId ? project?.projectType?.type : "scrum";
    const path = props.match.path;
    const userId = getUser().userId;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const dropDown = useRef();

    const [selectTab, setSelectTab] = useState();

    const quickFilterList = [
        {
            value: "pending",
            label: "我的待办"
        },
        {
            value: "ending",
            label: "我的已办"
        },
        {
            value: "creat",
            label: "我创建的"
        },
        {
            value: "overdue",
            label: "已逾期"
        }
    ]

    // useEffect(() => {
    //
    // }, [])


    /**
     * 选择快速筛选
     * @param {快速筛选} value
     */
    const selectType = (value) => {
        setQuickFilterValue(value)
        console.log("筛选条件++++++" + JSON.stringify(value))
        if (!value) {
            getAllWorkItem();
            return
        } else {
            let data = value;
            switch (data) {
                case "all":
                    getAllWorkItem();
                    break;
                case "pending":
                    getPendingWorkItem();
                    break;
                case "ending":
                    getEndingWorkItem();
                    break;
                case "creat":
                    getCreatWorkItem();
                    break;
                case "overdue":
                    getOverdueWorkItem();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 获取全部事项
     */
    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            assignerId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },

        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    /**
     * 获取待办事项
     */
    const getPendingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            assignerId: userId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    /**
     * 获取已办事项
     */
    const getEndingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            assignerId: userId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "done" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    /**
     * 获取我创建的事项
     */
    const getCreatWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: userId,
            assignerId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues);
        getWorkList(initValues);
    }

    /**
     * 获取已逾期的事项
     */
    const getOverdueWorkItem = () => {
        let initValues = {
            sprintId: sprintId,
            overdue: true,
            builderId: userId,
            assignerId: userId,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    /**
     * 获取事项列表
     */
    const getWorkList = (initValues) => {
        if (workShowType === "bodar"){
            getWorkBoardList(initValues)
        }else {
            setWorkDeatilInList(workStore, initValues)
        }
    }

    const clearSelect = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectTab(null)
        getAllWorkItem()
    }

    /**
     * 根据条件获取状态节点列表
     */
    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        const newStateNodeList = stateNodeList.filter((item, index) => {
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个
        });

        return newStateNodeList;
    }


    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showDropdown])

    const closeModal = (e) => {
        if (!dropDown.current) {
            return;
        }
        if (!dropDown.current.contains(e.target) && dropDown.current !== e.target) {
            setShowDropdown(false)
        }
    }

    return (<div className="worktype-select" ref={dropdownRef}>
                <div
                    className="select-content"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <span className="select-view-text">
                      {!selectTab ? "所有事项" : selectTab}

                    </span>
                    <div className="select-view-icon">
                        {
                            selectTab ?
                            <svg className="svg-icon" aria-hidden="true" onClick={(e) => clearSelect(e)}>
                                <use xlinkHref="#icon-cancel"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-downdrop"></use>
                            </svg>
                        }
                    </div>

                </div>

                {showDropdown && (
                    <div className="worktype-dropdown" ref={dropDown}>
                        {/* 系统类型选项 */}
                        {quickFilterList?.map(item => (
                            <div
                                key={item.value}
                                className={`worktype-option ${selectTab === item.value ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectTab(item.label)
                                    selectType(item.value);
                                    setShowDropdown(false);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}

export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterSelect)));