/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 16:51:10
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 17:12:11
 * @Description: 事项类型筛选tab
 */
import React, { useEffect, useState, useRef } from "react";
import { observer, inject } from "mobx-react";
import "./WorkTypeTab.scss";
import { withRouter } from "react-router";
import { searchWorkList } from "./WorkSearch";
import {Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";
const WorkTypeTab = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 解析store数据
    const {  findWorkTypeDmList, tabValue, setTabValue, eveWorkTypeNum } = workStore;
    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);
    const [title, setTitle] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const dropDown = useRef();
    const [selectTab, setSelectTab] = useState("all")

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
                // if (res.data.length > 0) {
                //     setMoreTabValue(res.data[0].workType)
                // }

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
        // setMoreTabValue(value)
        search({ workTypeId: value.id })
        setTabValue({
            id: value.id,
            type: "custom",
            value: value.id,
            label: value.name
        })
        // setShowMoreTab(false)
    }

    /**
     * 选择事项类型
     * @param {事项类型} value
     */
    const selectType = (value) => {
        if (value === "all") {
            setSelectTab("all")
            search({ workTypeId: "" })
            // setTabValue({
            //     id: "all",
            //     type: "system",
            //     value: null,
            //     label: null
            // })
        } else {
            // setTabValue({
            //     id: value.id,
            //     type: "system",
            //     value: value.id,
            //     label: value.name,
            //     code: value.code
            // })
            setSelectTab(value.id)
            search({
                workTypeId: value.id,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    const clearSelect = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setTabValue({
            id: "all",
            type: "system",
            value: null,
            label: null
        })
        search({ workTypeId: "" })
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
            // if (onBlur) {
            //     onBlur()
            // }
            // if (onSearchChange) {
            //     cancel()
            // }
            setShowDropdown(false)
        }
    }

    return (
        <div className="work-type-tabs">
            {
                <div
                    className={`filter-tab ${selectTab === "all" ? "active-tabs" : ""}`}
                    key={"all"}
                    onClick={() => selectType("all")}
                >
                    {"所有"}
                    <span className="select-number">
                            {setWorkNum(eveWorkTypeNum['all'])}
                    </span>
                </div>
            }
            {
                workSystem.map(item => {
                    return <div
                        className={`filter-tab ${selectTab === item.workType.id ? "active-tabs" : ""}`}
                        key={item.workType.id}
                        onClick={() => {
                            selectType(item.workType)
                            setTitle("")
                        }}
                    >
                        {item.workType.name}
                        <span className="select-number">
                            {setWorkNum(eveWorkTypeNum[item.workType.code])}
                        </span>
                    </div>
                })
            }
            {workCustom.length > 0 && (
                <Dropdown
                    overlay={
                        <Menu>
                            {workCustom?.map(item => (
                                <Menu.Item
                                    key={item.workType.id}
                                    onClick={() => {
                                        selectType(item.workType);
                                        setTitle(item.workType.name)
                                    }}
                                >
                                    {item.workType.name}
                                    <span className="select-number">
                                        {setWorkNum(eveWorkTypeNum[item.workType.code])}
                                    </span>
                                </Menu.Item>
                            ))}
                        </Menu>
                    }
                    placement="bottomLeft"
                >
                    <div className={`filter-tab ${title !== "" ? "active-tabs":""}`}>
                        {title} <DownOutlined />
                    </div>
                </Dropdown>
            )}
        </div>
    );
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTypeTab)));