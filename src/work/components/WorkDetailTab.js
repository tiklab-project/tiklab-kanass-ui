/*
 * @Descripttion: 事项详情页面的tab
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:03:36
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import "./WorkDetailTab.scss";
import {withRouter} from "react-router";

const WorkDetailTab = (props) => {
    const {  workInfo, relationModalNum, tabValue, setTabValue} = props;
    const treePath = workInfo.treePath;
    const deep = treePath ? treePath.split(";").length : 1;
 

    const [workTypeText, setWorkTypeText] = useState("事项")
    const workTypeCode = workInfo.workTypeCode;

    const path = props.match.path;

    /**
     * 设置事项类型文本
     */
    useEffect(() => {
        if (workInfo) {
            if (workInfo.workTypeCode) {
                switch (workInfo.workTypeCode) {
                    case "task":
                        setWorkTypeText("任务");
                        break;
                    case "demand":
                        setWorkTypeText("需求");
                        break;
                    case "defect":
                        setWorkTypeText("缺陷");
                        break;
                    case "epic":
                        setWorkTypeText("需求");
                        break;
                    default:
                        setWorkTypeText("事项");
                        break;
                }
            }
        }
        return
    }, [workInfo])



    // const [tabValue, setTabValue] = useState(1);
    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();

    /**
     * 监听鼠标事件，关闭更多tab
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [setShowMoreTab])

    /**
     * 关闭更多tab
     */
    const closeModal = (e) => {
        if (!tabsDropDown.current) {
            return;
        }
        if (!tabsDropDown.current.contains(e.target) && tabsDropDown.current !== e.target) {
            setShowMoreTab(false)
        }
    }

    /**
     * 设置更多tab
     */
    const setTabMore = (text, value) => {
        setTabValue(value)
        setShowMoreTab(false)
        setMoreTabsNum(value)
    }

    /**
     * 设置更多tab数量
     */
    const setMoreTabsNum = (tabValue) => {
        let num = 0;
        switch (tabValue) {
            case 6:
                num = relationModalNum?.dynamic;
                break;
            case 7:
                num = relationModalNum?.workComment;
                break;
            case 8:
                num = relationModalNum?.workDoucment;
                break;
            case 9:
                num = relationModalNum?.workTestCase;
                break;
            default:
                break;
        }
        return num;
    }

    /**
     * 渲染事项详情页面的tab
     */
    return (
        <div className="workitem-tabs">
            <div className={`tabs-bar ${tabValue === 1 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(1)} >
                详细信息
            </div>
            {
                path !== "/project/:id/appraised/:appraised" &&
                <div className={`tabs-bar ${tabValue === 2 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(2)}>
                    动态日志
                </div>
            }
            <div className={`tabs-bar ${tabValue === 3 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(3)}>
                关联事项
            </div>
            {
                path !== "/project/:id/appraised/:appraised" &&
                <div className={`tabs-bar ${tabValue === 4 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(4)}>
                    关联数据
                </div>
            }
        </div>
    )
};
export default withRouter(inject("workStore")(observer(WorkDetailTab)));
