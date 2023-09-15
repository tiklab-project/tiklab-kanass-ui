import React, { useEffect, useState, useRef } from "react";
import "./WorkChangeView.scss";
import { Radio, Popconfirm } from 'antd';
import Button from "../../common/button/Button";
import { useSelector } from "tiklab-plugin-core-ui";
import { withRouter } from "react-router";
import { getVersionInfo } from "tiklab-core-ui"
import { removeSessionStorage } from "../../common/utils/setSessionStorage";
const WorkFilterSort = (props) => {
    const { getPageList, getPageTree, getWorkConditionPage,
        getWorkConditionPageTree, getWorkBoardList, viewType,
        workShowType, setWorkShowType, setViewType, buttonType, searchCondition } = props;
    const [showViewDropDown, setShowViewDropDown] = useState(false);
    const treeDropDown = useRef();
    const gantte = useRef()
    const pluginStore = useSelector(state => state.pluginStore);
    const versionInfo = getVersionInfo();
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const path = props.match.path;
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, true);
        return () => {
            window.removeEventListener("mousedown", closeModal, true);
        }
    }, [showViewDropDown])

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

    const goPlugin = () => {
        window.open(`${homes_url}/account/subscribe/subscribeList`)
    }
    const changeWorkView = (value, route) => {
        setWorkShowType(value)
        if(path.indexOf("projectDetail") > -1){
            props.history.push(`/index/projectDetail/${projectId}/work${route}`)
        }
        if(path.indexOf("work") === 7){
            props.history.push(`/index/work${route}`)
        }

        if(path.indexOf("sprintdetail") > 1){
            props.history.push(`/index/${projectId}/sprintdetail/${sprintId}/work${route}`)
        }
        if(path.indexOf("versiondetail") > 1){
            props.history.push(`/index/${projectId}/versiondetail/${versionId}/work${route}`)
        }
        // switch (value) {
        //     case "list":
               
        //         break;
        //     case "table":
        //         props.history.push(`/index/projectDetail/${projectId}/workTable`)
        //         // if (viewType === "tile") {
        //         //     getWorkConditionPage(data);
        //         // } else if (viewType === "tree") {
        //         //     getWorkConditionPageTree(data);
        //         // }
        //         break;
        //     case "bodar":
        //         props.history.push(`/index/projectDetail/${projectId}/workBodar`)
        //         // getWorkBoardList();
        //         break;
        //     default:
        //         break;
        // }
        removeSessionStorage("detailCrumbArray");
        setShowViewDropDown(false)
    };

    //切换平铺或者树状
    const changTileOrTree = (e) => {
        const value = e.target.value
        setViewType(value)

        switch (value) {
            case "tile":
                if (workShowType === "list") {
                    getPageList();
                } else if (workShowType === "table") {
                    getWorkConditionPage();
                }
                break;
            case "tree":
                if (workShowType === "list") {
                    getPageTree();
                } else if (workShowType === "table") {
                    getWorkConditionPageTree();
                }
                break;
            default:
                break;
        }
        setShowViewDropDown(false)
    }


    return <div className="work-change-view">
        {
            buttonType === "button" ?
                <Button onClick={() => setShowViewDropDown(true)}>
                    <svg className="big-icon" aria-hidden="true">
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
                            return <div
                                key={item.value}
                                className={`dropdown-item ${item.value === workShowType ? "view-type-select" : ""}`}
                                onClick={() => changeWorkView(item.value, item.path)}>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-${item.value}`}></use>
                                </svg>
                                {item.title}

                            </div>
                        })
                    }
                    {
                        pluginStore.filter(item => item.point === "work-gantt").length > 0 && versionInfo.expired === false ? <div
                            className={`dropdown-item ${"time" === workShowType ? "view-type-select" : ""}`}
                            onClick={() => changeWorkView("time", "Time")}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-time`}></use>
                            </svg>
                            甘特图
                        </div>
                            :
                            <Popconfirm
                                ref={gantte}
                                title="付费插件，是否购买？"
                                placement="left"
                                onConfirm={(e) => goPlugin(e)}
                                getPopupContainer={() => treeDropDown.current}
                            >
                                <div className={`dropdown-buy-item ${"time" === workShowType ? "view-type-select" : ""}`}>
                                    <div className="dropdown-item">
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-time`}></use>
                                        </svg>
                                        甘特图

                                    </div>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-ques`}></use>
                                    </svg>
                                </div>
                            </Popconfirm>
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
    </div>
}

export default withRouter(WorkFilterSort);