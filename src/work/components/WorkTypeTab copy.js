import React, { useEffect, useState, useRef } from "react";
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkTypeTab.scss";
import { withRouter } from "react-router";
const WorkTypeTab = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 解析store数据
    const { getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, setWorkId, setWorkIndex,
        viewType, findWorkTypeDmList, tabValue, setTabValue, eveWorkTypeNum } = workStore;

    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);

    const [moreTabValue, setMoreTabValue] = useState();
    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();
    useEffect(() => {
        findWorkTypeDmList({ projectId: projectId, grouper: "system" }).then(res => {
            if (res.code === 0) {
                setWorkSystem(res.data)
            }
        })

        findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
            if (res.code === 0) {
                setWorkCustom(res.data)
                if (res.data.length > 0) {
                    setMoreTabValue(res.data[0].workType)
                }

            }
        })
    }, [])

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

    const selectCustomType = (value) => {
        setMoreTabValue(value)
        search({ workTypeId: value.id })
        setTabValue({
            id: value.id, type: "custom",
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        })
        setShowMoreTab(false)
    }

    const selectType = (value) => {
        if (value === "all") {
            search({ workTypeId: "" })
            setTabValue({
                id: "all", type: "system",
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        } else {
            setTabValue({ id: value.id, type: "system" })
            search({
                workTypeId: value.id,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    //查找事务
    const search = values => {
        if ((workShowType === "list" || workShowType === "table" || workShowType === "time") && viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(values)
        }
    };

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
                className={`tabs-bar ${tabValue.id === "all" ? "tabs-bar-select" : ""}`} 
                onClick={() => selectType("all")} key={"all"}
            >
                全部
                <span style={{fontSize: "12px"}}>({setWorkNum(eveWorkTypeNum.all)})</span>
                {/* <span>({setWorkNum(1009)})</span> */}
            </div>
            {
                workSystem && workSystem.map(item => {
                    return <div 
                        key={item.id} 
                        className={`tabs-bar ${tabValue.id === item.workType.id ? "tabs-bar-select" : ""}`} 
                        onClick={() => selectType(item.workType)}
                    >   
                        {item.workType.name}
                        <span style={{fontSize: "12px"}}>({setWorkNum(eveWorkTypeNum[item.workType.code])})</span>
                    </div>
                })
            }
            {
                workCustom && workCustom.length === 1 && <div className="tabs-more">
                    <div className="tabs-more-button" onClick={() => selectCustomType(moreTabValue)}>
                        <div className={`tabs-bar ${tabValue.id === moreTabValue?.id ? "tabs-bar-select" : ""}`}>{moreTabValue?.name}</div>
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
                                return <div key={item.id} className={`tabs-dropdown-item ${tabValue.id === item.workType.id ? "tabs-dropdown-select" : ""}`} onClick={() => selectCustomType(item.workType)}>{item.workType.name}</div>
                            })
                        }


                    </div>
                </div>
            }


        </div>
    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTypeTab)));