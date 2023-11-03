import React, { useEffect, useState, useRef } from "react";
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkQuickTab.scss";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
const WorkQuickTab = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    // 解析store数据
    const { getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, setWorkId, setWorkIndex,
        viewType, setSearchCondition, findStateNodeList, setQuickFilterValue, 
        quickFilterValue, eveWorkTypeNum, setSearchType } = workStore;
    
    const userId = getUser().userId;
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




    const selectMenu = (value) => {
        if (workShowType !== "list") {
            setQuickFilterValue(value)
            setSearchType(value.value)
        }
        switch (value.value) {
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

    const getAllWorkItem = () => {
        const initValues = {
            isQuick: true,
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            
        }
        setSearchCondition(initValues)
        getWorkList();
    }

    const getPendingWorkItem = () => {
        let initValues = {
            isQuick: true,
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        let initValues = {
            isQuick: true,
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "done" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        let initValues = {
            isQuick: true,
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: userId,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues);
        getWorkList();
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            isQuick: true,
            sprintId: sprintId,
            overdue: true,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        getWorkList();
    }

    const getWorkList = () => {
        if ((workShowType === "list" || workShowType === "table" || workShowType === "time") && viewType === "tree") {
            getWorkConditionPageTree().then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage().then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList()
        }
    }

    


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
        return stateNodeList;
    }

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
        <div className="work-quick-tabs">
            <div 
                className={`tabs-bar ${quickFilterValue?.value === "all" ? "tabs-bar-select" : ""}`} 
                onClick={() => selectMenu({value: "all", label: "全部"})} key={"all"}
            >
                全部
                <span style={{fontSize: "12px", paddingLeft: "3px", color: "#999"}}>{setWorkNum(eveWorkTypeNum.all)}</span>

            </div>
            {
                quickFilterList && quickFilterList.map(item => {
                    return <div 
                        key={item.value} 
                        className={`tabs-bar ${quickFilterValue?.value === item.value ? "tabs-bar-select" : ""}`} 
                        onClick={() => selectMenu(item)}
                    >   
                        {item.label}
                        <span style={{fontSize: "12px", paddingLeft: "3px", color: "#999"}}>{setWorkNum(eveWorkTypeNum[item.value])}</span>
                    </div>
                })
            }


        </div>
    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkQuickTab)));