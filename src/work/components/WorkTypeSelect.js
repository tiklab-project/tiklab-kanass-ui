import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import React, {useEffect, useRef, useState} from "react";
import {searchWorkList} from "./WorkSearch";
import "./WorkTypeSelect.scss"
import {Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";

const WorkTypeSelect = (props) =>{
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 解析store数据
    const { findWorkTypeDmList, eveWorkTypeNum } = workStore;
    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const dropDown = useRef();

    // 添加本地状态管理选中值
    const [selectedTab, setSelectedTab] = useState({
        id: "all",
        type: "system",
        value: null,
        label: null,
        code: null
    });

    useEffect(() => {
        //获取系统内置事项类型
        findWorkTypeDmList({ projectId: projectId, grouper: "system" }).then(res => {
            if (res.code === 0) {
                setWorkSystem(res.data)
            }
        })

        //获取自定义事项类型
        findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
            if (res.code === 0) {
                setWorkCustom(res.data)
            }
        })
        return;
    }, [])

    /**
     * 搜索事项
     * @param {搜索条件} values
     */
    const search = values => {
        searchWorkList(workStore, values)
    };

    /**
     * 选择自定义事项类型
     * @param {事项类型} value
     */
    const selectCustomType = (value) => {
        const newTab = {
            id: value.id,
            type: "custom",
            value: value.id,
            label: value.name
        };
        setSelectedTab(newTab);
        search({ workTypeId: value.id });
        setShowDropdown(false);
    }

    /**
     * 选择事项类型
     * @param {事项类型} value
     */
    const selectType = (value) => {
        if (value === "all") {
            const newTab = {
                id: "all",
                type: "system",
                value: null,
                label: null,
                code: null
            };
            setSelectedTab(newTab);
            search({ workTypeId: "" });
        } else {
            const newTab = {
                id: value.id,
                type: "system",
                value: value.id,
                label: value.name,
                code: value.code
            };
            setSelectedTab(newTab);
            search({
                workTypeId: value.id,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            });
        }
        setShowDropdown(false);
    }

    const clearSelect = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const newTab = {
            id: "all",
            type: "system",
            value: null,
            label: null,
            code: null
        };
        setSelectedTab(newTab);
        search({ workTypeId: "" });
    }

    /**
     * 设置事项数量
     * @param {事项数量} num
     * @returns {事项数量}
     */
    const setWorkNum = (num) => {
        let showNum;
        const isMax = Math.floor(num / 1000);
        if(isMax >= 1){
            showNum = `${isMax}k+`
        }else {
            showNum = num;
        }
        return showNum;
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

    return (
        <div className="worktype-select" ref={dropdownRef}>
            <div
                className="select-content"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                    <span className="select-view-text">
                      {selectedTab.id === "all" ? "事项类型" : selectedTab.label}
                    </span>
                <div className="select-view-icon">
                    {
                        selectedTab.id !== "all" && (
                            <>
                                {/*<div className="select-number">*/}
                                {/*    {setWorkNum(eveWorkTypeNum[selectedTab.code])}*/}
                                {/*</div>*/}
                                <svg className="svg-icon" aria-hidden="true" onClick={(e) => clearSelect(e)}>
                                    <use xlinkHref="#icon-cancel"></use>
                                </svg>
                            </>
                        )
                    }
                    {
                        selectedTab.id === "all" && (
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-downdrop"></use>
                            </svg>
                        )
                    }
                </div>
            </div>

            {showDropdown && (
                <div className="worktype-dropdown" ref={dropDown}>
                    {/* 全部选项 */}
                    <div
                        className={`worktype-option ${selectedTab.id === "all" ? "selected" : ""}`}
                        onClick={() => {
                            selectType("all");
                        }}
                    >
                        所有事项
                        <span className="select-number">
                                {setWorkNum(eveWorkTypeNum.all)}
                            </span>
                    </div>

                    {/* 系统类型选项 */}
                    {workSystem?.map(item => (
                        <div
                            key={item.id}
                            className={`worktype-option ${selectedTab.id === item.workType.id ? "selected" : ""}`}
                            onClick={() => {
                                selectType(item.workType);
                            }}
                        >
                            {item.workType.name}
                            <span className="select-number">
                                    {setWorkNum(eveWorkTypeNum[item.workType.code])}
                                </span>
                        </div>
                    ))}

                    {/* 自定义类型选项 */}
                    {workCustom?.map(item => (
                        <div
                            key={item.id}
                            className={`worktype-option ${selectedTab.id === item.workType.id ? "selected" : ""}`}
                            onClick={() => {
                                selectCustomType(item.workType);
                            }}
                        >
                            {item.workType.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTypeSelect)));