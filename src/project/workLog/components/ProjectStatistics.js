/*
 * @Descripttion: 工时页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 15:36:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:05:52
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import ProjectLogStatistics from "./ProjectLogStatistics";
import ProjectWorkItemLogStatistics from "./ProjectWorkItemLogStatistics"
import "./ProjectStatistics.scss";


const ProjectStatistics = (props) => {
    const { workStore, logStore } = props
    const { findProjectList } = workStore;
    const { findAllWorkLog, perWorkingHours } = logStore;
    const [activeTab, setActiveTab] = useState("user")

    useEffect(() => {
        findProjectList()
        findAllWorkLog()
        return;
    }, [])

    return (
        <Fragment>
            <div className="projectlog-statistics-header">
                <div className="projectlog-statistics-title">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-home"></use>
                    </svg>
                    项目工时统计
                </div>
                <div className="projectlog-statistics-tabs">
                    <div
                        className={`projectlog-statistics-tab ${activeTab === "user" ? "active-tabs" : ""}`}
                        key={"user"}
                        onClick={() => setActiveTab("user")}
                    >
                        成员
                    </div>
                    <div
                        className={`projectlog-statistics-tab ${activeTab === "workitem" ? "active-tabs" : ""}`}
                        key={"workitem"}
                        onClick={() => setActiveTab("workitem")}
                    >
                        事项
                    </div>

                    {/* <LogFilter type={activeTab} /> */}
                </div>
            </div>
            {
                activeTab === "user" && <ProjectLogStatistics perWorkingHours={perWorkingHours} />
            }
            {
                activeTab === "workitem" && <ProjectWorkItemLogStatistics {...props} />
            }
        </Fragment>
    )
}
export default inject('workStore', 'logStore')(observer(ProjectStatistics));