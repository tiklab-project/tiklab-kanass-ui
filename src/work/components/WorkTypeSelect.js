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
        // <div className="worktype-select" ref={dropdownRef}>
        //         <div
        //             className="select-content"
        //             onClick={() => setShowDropdown(!showDropdown)}
        //         >
        //             <span className="select-view-text">
        //               {tabValue?.id === "all" ? "事项类型" :tabValue?.label}
        //
        //             </span>
        //             <div className="select-view-icon">
        //                 {
        //                     tabValue?.id !== "all" && <div className="select-number">
        //                         {setWorkNum(eveWorkTypeNum[tabValue.code])}
        //                     </div>
        //                 }
        //                 {
        //                     tabValue?.id !== "all" ?
        //                     <svg className="svg-icon" aria-hidden="true" onClick={(e) => clearSelect(e)}>
        //                         <use xlinkHref="#icon-cancel"></use>
        //                     </svg>
        //                     :
        //                     <svg className="svg-icon" aria-hidden="true">
        //                         <use xlinkHref="#icon-downdrop"></use>
        //                     </svg>
        //                 }
        //             </div>
        //
        //         </div>
        //
        //         {showDropdown && (
        //             <div className="worktype-dropdown" ref={dropDown}>
        //                 {/* 全部选项 */}
        //                 {/*<div*/}
        //                 {/*    className={`worktype-option ${tabValue?.id === "all" ? "selected" : ""}`}*/}
        //                 {/*    onClick={() => {*/}
        //                 {/*        selectType("all");*/}
        //                 {/*        setShowDropdown(false);*/}
        //                 {/*    }}*/}
        //                 {/*>*/}
        //                 {/*    事项类型*/}
        //                 {/*    <span className="select-number">*/}
        //                 {/*        {setWorkNum(eveWorkTypeNum.all)}*/}
        //                 {/*    </span>*/}
        //                 {/*</div>*/}
        //
        //                 {/* 系统类型选项 */}
        //                 {workSystem?.map(item => (
        //                     <div
        //                         key={item.id}
        //                         className={`worktype-option ${tabValue?.id === item.workType.id ? "selected" : ""}`}
        //                         onClick={() => {
        //                             selectType(item.workType);
        //                             setShowDropdown(false);
        //                         }}
        //                     >
        //                         {item.workType.name}
        //                         <span className="select-number">
        //                             {setWorkNum(eveWorkTypeNum[item.workType.code])}
        //                         </span>
        //                     </div>
        //                 ))}
        //
        //                 {/* 自定义类型选项 */}
        //                 {workCustom?.map(item => (
        //                     <div
        //                         key={item.id}
        //                         className={`worktype-option ${tabValue?.id === item.workType.id ? "selected" : ""}`}
        //                         onClick={() => {
        //                             selectCustomType(item.workType);
        //                             setShowDropdown(false);
        //                         }}
        //                     >
        //                         {item.workType.name}
        //                     </div>
        //                 ))}
        //             </div>
        //         )}
        // </div>
    );
}

export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTypeSelect)));