/*
 * @Descripttion: 新增事项趋势
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "./ProjectStatusNum.scss";
import HomeStore from "../store/HomeStore";
import ProjectStore from "../../../project/project/store/ProjectStore";
import { withRouter } from "react-router";

const ProjectStatusNum = (props) => {
    const { statisticsProjectByStatus } = HomeStore;
    const { setProjectPageParams, setProjectQuickFilter } = ProjectStore
    const [projectStatistics, setProjectStatistics] = useState({})
    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        statisticsProjectByStatus().then(res => {
            if (res.code === 0) {
                setProjectStatistics(res.data)
            }
        })
        return;
    }, [])



    const data = [
        {
            value: "total",
            label: "全部",
            icon: "allwork",
            code: "total",
            color: "#59ADF8"
        },
        {
            value: "progress",
            label: "进行中",
            icon: "progress",
            code: "progress",
            color: "#52C41A"
        },
        {
            value: "noend",
            label: "未结束",
            icon: "endwork",
            code: "noend",
            color: "#FF9552"
        },
        {
            value: "overdue",
            label: "逾期",
            icon: "overdue",
            code: "overdue",
            color: "#F76E5C"
        }
    ]

    const selectMenu = (item) => {
        const value = item.value;
        let params = {}
        setProjectQuickFilter(item)
        switch (value) {
            case "total":
                    params = {
                        projectStates: null,
                        overdue: false
                    }
                    setProjectPageParams(params);
                    break;
            case "progress":
                params = {
                    projectStates: ["2"],
                    overdue: false
                }
                setProjectPageParams(params);
                break;
            case "noend":
                params = {
                    projectStates: ["1", "2"],
                    overdue: false
                }
                setProjectPageParams(params);
                break;
            case "overdue":
                params = {
                    projectStates: ["1", "2"],
                    overdue: true
                }
                setProjectPageParams(params);
                break;
            default:
                break;
        }
        props.history.push("/project")
        sessionStorage.setItem("menuKey", "project")
    }


    return (
        <Fragment>
            <div className="project-status-num">
                <div className="project-status-num-top">
                    <div className="project-status-num-title">
                        项目统计
                    </div>
                </div>
                {/* <div className="project-status-num-content" id={`new-work-trend`} /> */}
                <div className="project-status-num-content">
                    {
                        data && data.map(item => {
                            return <div
                                id={item.value}
                                key = {item.value}
                                className="project-status-num-content-box"
                                onClick={() => selectMenu(item)}
                            >

                                <div className="project-status-num-content-box-right">
                                    <div className="project-status-num-content-box-num" style={{ color: item.color }}>{projectStatistics[item.value]}</div>
                                    <div className="project-status-num-content-box-name">{item.label}</div>
                                </div>

                            </div>
                        })
                    }

                </div>
            </div>
        </Fragment >

    )
}

export default withRouter(observer(ProjectStatusNum));