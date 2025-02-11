
import React, { useEffect, useState, useRef } from "react";
import "./WorkChangeView.scss";
import { Radio, Popconfirm } from 'antd';
import Button from "../../common/button/Button";

import { withRouter } from "react-router";

import { removeSessionStorage } from "../../common/utils/setSessionStorage";
import { observer, inject } from "mobx-react";
import { getVersionInfo } from "tiklab-core-ui";
import WorkGanttFree from "./WorkGanttFree";

const WorkChangeView = (props) => {
    const { buttonType, workStore } = props;
    const { getWorkConditionPage, getWorkConditionPageTree, viewType, workShowType, setWorkShowType,
        setViewType, setWorkId, setWorkIndex } = workStore;

    // 视图下拉框
    const [showViewDropDown, setShowViewDropDown] = useState(false);
    const treeDropDown = useRef();
    const versionInfo = getVersionInfo();

    const [workGanttFreeVisable, setWorkGanttFreeVisable] = useState(false);
    
    /**
     * 监听视图切换
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, true);
        return () => {
            window.removeEventListener("mousedown", closeModal, true);
        }
    }, [showViewDropDown])

    /**
     * 关闭视图下拉框
     */
    const closeModal = (e) => {
        if (!treeDropDown.current) {
            return;
        }
        if (!treeDropDown.current.contains(e.target) && treeDropDown.current !== e.target) {
            setShowViewDropDown(false)
        }
    }

    const viewList = [
        {
            value: "table",
            path: "Table",
            title: "列表"
        },
        {
            value: "list",
            path: "List",
            title: "详情"
        },
        {
            value: "bodar",
            path: "Bodar",
            title: "看板"
        }
    ]

    /**
     * 甘特图视图
     */
    const ganttViewList = {
        value: "gantt",
        path: "Gantt",
        title: "甘特图"
    }

    /**
     * 切换视图
     */
    const changeWorkView = (item) => {
        if (item.value === workShowType) return;
        if (item.value === "gantt") {
            if (versionInfo.expired === true) {
                setWorkGanttFreeVisable(true);
                return
            }
            
        }
        setWorkShowType(item.value)
        setWorkId()

        removeSessionStorage("detailCrumbArray");
        setShowViewDropDown(false)
    };

    /**
     * 切换平铺或者树状
     */
    const changTileOrTree = (e) => {
        const value = e.target.value
        setViewType(value)
        switch (value) {
            case "tile":
                if (workShowType === "list") {
                    // 获取小列表，并展示第一个事项详情
                    getPageList();
                } else if (workShowType === "table") {
                    // 获取列表
                    getWorkConditionPage();
                } else if (workShowType === "gantt") {
                    const values = {
                        pageParam: {
                            pageSize: 20,
                            currentPage: 1,
                        }
                    }
                    // 获取列表
                    getWorkConditionPage(values);
                }
                break;
            case "tree":
                if (workShowType === "list") {
                    getPageTree();
                } else if (workShowType === "table") {
                    getWorkConditionPageTree();
                } else if (workShowType === "gantt") {
                    const values = {
                        pageParam: {
                            pageSize: 20,
                            currentPage: 1,
                        }
                    }
                    getWorkConditionPageTree(values);
                }
                break;
            default:
                break;
        }
        setShowViewDropDown(false)
    }

    /**
     * 获取树状列表
     */
    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.code === 0) {
                const list = res.data.dataList;
                if (list.length > 0) {
                    setWorkIndex(1)
                    setWorkId(list[0].id)
                } else {
                    setWorkIndex(0)
                    setWorkId(0)
                }
            }
        })
    }

    /**
     * 获取列表
     */
    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.code === 0) {
                const list = res.data.dataList;
                if (list.length > 0) {
                    setWorkIndex(1)
                    setWorkId(list[0].id)
                } else {
                    setWorkIndex(0)
                    setWorkId(0)
                }
            }
        })
    }
    

    return <div className="work-change-view">
        {
            buttonType === "button" ?
                <Button onClick={() => setShowViewDropDown(true)}>
                    <svg className="icon-20" aria-hidden="true">
                        <use xlinkHref={`#icon-${workShowType}`}></use>
                    </svg>
                </Button>
                :
                <svg className={`workitem-svg-icon ${showViewDropDown ? 'workitem-svg-active' : ''}`} aria-hidden="true" onClick={() => setShowViewDropDown(true)}>
                    <use xlinkHref={`#icon-${workShowType}`}></use>
                </svg>

        }

        {
            showViewDropDown ? <div className="change-view-dropdown" ref={treeDropDown}>
                <div className="dropdown-head">切换视图</div>
                <div>
                    {
                        viewList.map(item => {
                            return <div key = {item.value}>
                                <div
                                    key={item.value}
                                    className={`dropdown-item ${item.value === workShowType ? "view-type-select" : ""}`}
                                    onClick={() => changeWorkView(item)}>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-${item.value}`}></use>
                                    </svg>
                                    {item.title}


                                </div>
                            </div>

                        })
                    }


                    {
                        versionInfo.expired === false ?
                            <div
                                className={`dropdown-item ${"gantt" === workShowType ? "view-type-select" : ""}`}
                                onClick={() => changeWorkView(ganttViewList)}
                            >
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-gantt`}></use>
                                </svg>
                                甘特图
                            </div>
                            :
                            <div
                                className={`dropdown-buy-item ${"gantt" === workShowType ? "view-type-select" : ""}`}
                                onClick={() => changeWorkView(ganttViewList)}
                            >
                                <div className="dropdown-item">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-gantt`}></use>
                                    </svg>
                                    甘特图
                                </div>
                                {
                                    versionInfo.expired === true && <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-member`}></use>
                                    </svg>
                                }
                            </div>
                    }

                </div>

                <div className="view-list">
                    {
                        workShowType !== "bodar" &&
                        <Radio.Group onChange={(e) => changTileOrTree(e)} value={viewType}>
                            <Radio value={"tree"}>树状</Radio>
                            <Radio value={"tile"}>平铺</Radio>
                        </Radio.Group>
                    }
                </div>

            </div>
                :
                <></>
        }
        <WorkGanttFree
            workGanttFreeVisable={workGanttFreeVisable}
            setWorkGanttFreeVisable={setWorkGanttFreeVisable}
        />
    </div>
}
export default withRouter(inject("workStore")(observer(WorkChangeView)));