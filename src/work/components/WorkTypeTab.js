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
const WorkTypeTab = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 解析store数据
    const {  findWorkTypeDmList, tabValue, setTabValue, eveWorkTypeNum } = workStore;
    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);

    const [moreTabValue, setMoreTabValue] = useState();
    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();
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
                if (res.data.length > 0) {
                    setMoreTabValue(res.data[0].workType)
                }

            }
        })
        return;
    }, [])

    /**
     * 关闭更多事项类型弹窗
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [setShowMoreTab])

    const closeModal = (e) => {
        if (!tabsDropDown.current) {
            return;
        }
        if (!tabsDropDown.current.contains(e.target) && tabsDropDown.current !== e.target) {
            setShowMoreTab(false)
        }
    }

    /**
     * 选择自定义事项类型
     * @param {事项类型} value 
     */
    const selectCustomType = (value) => {
        setMoreTabValue(value)
        search({ workTypeId: value.id })
        setTabValue({
            id: value.id, 
            type: "custom",
            value: value.id,
            label: value.name
        })
        setShowMoreTab(false)
    }

    /**
     * 选择事项类型
     * @param {事项类型} value 
     */
    const selectType = (value) => {
        if (value === "all") {
            search({ workTypeId: "" })
            setTabValue({
                id: "all", 
                type: "system",
                value: null,
                label: null
            })
        } else {
            setTabValue({ 
                id: value.id, 
                type: "system",
                value: value.id, 
                label: value.name
            })
            search({
                workTypeId: value.id,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    /**
     * 搜索事项
     * @param {搜索条件} values 
     */
    const search = values => {
        searchWorkList(workStore, values)
    };

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

    return (
        <div className="worktype-tabs">
            <div 
                className={`tabs-bar ${tabValue?.id === "all" ? "tabs-bar-select" : ""}`} 
                onClick={() => selectType("all")} key={"all"}
            >
                全部
                <span className="tabe-bar-num">{setWorkNum(eveWorkTypeNum.all)}</span>
            </div>
            {
                workSystem && workSystem.map(item => {
                    return <div 
                        key={item.id} 
                        className={`tabs-bar ${tabValue?.id === item.workType.id ? "tabs-bar-select" : ""}`} 
                        onClick={() => selectType(item.workType)}
                    >   
                        {item.workType.name}
                        <span className="tabe-bar-num">{setWorkNum(eveWorkTypeNum[item.workType.code])}</span>
                    </div>
                })
            }
            {
                workCustom && workCustom.length === 1 && <div className="tabs-more">
                    <div className="tabs-more-button" onClick={() => selectCustomType(moreTabValue)}>
                        <div className={`tabs-bar ${tabValue?.id === moreTabValue?.id ? "tabs-bar-select" : ""}`}>{moreTabValue?.name}</div>
                    </div>
                </div>
            }
            {
                workCustom && workCustom.length > 1 && <div className="tabs-more">
                    <div className="tabs-more-button" onClick={() => setShowMoreTab(true)}>
                        <div className={`tabs-bar ${tabValue.type === "custom" ? "tabs-bar-select" : ""}`}>{moreTabValue?.name}</div>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-downdrop"></use>
                        </svg>
                    </div>

                    <div ref={tabsDropDown} className={`tabs-dropdown ${showMoreTab ? "tabs-dropdown-show" : "tabs-dropdown-hidden"}`}>
                        {
                            workCustom.map(item => {
                                return <div key={item.id} className={`tabs-dropdown-item ${tabValue?.id === item.workType.id ? "tabs-dropdown-select" : ""}`} onClick={() => selectCustomType(item.workType)}>{item.workType.name}</div>
                            })
                        }
                    </div>
                </div>
            }


        </div>
    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTypeTab)));