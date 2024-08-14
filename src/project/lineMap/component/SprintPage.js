/*
 * @Descripttion: 史诗页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect, useRef } from "react";
import SprintLineMap from "./SprintLineMap";
import InputSearch from "../../../common/input/InputSearch";
import "./SprintPage.scss"
import { withRouter } from "react-router";
import { observer, Provider } from "mobx-react";
import LineMapStore from "../store/LineMapStore";
import { Empty } from "antd";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const SprintPage = (props) => {
    const sprintLineRef = useRef();
    // 项目id
    const store = {
        lineMapStore: LineMapStore
    }
    const projectId = props.match.params.id;
    const [sprintList, setSprintList] = useState([])
    const { findSprintRoadMap, sprintRoadList } = LineMapStore;

    const [graph, setGraph] = useState()
    /**
     * 获取第一级史诗
     */


    useEffect(() => {
        findSprintRoadMap(projectId);
        return;
    }, [])

    const [archiveView, setArchiveView] = useState("week")
    const changeMonth = () => {
        setArchiveView("month");
        graph.dispose()
    }
    return (
        <Provider {...store}>
            <div className="sprint">
                <div className="sprint-action">
                    <div onClick={() => sprintLineRef.current.goToday()} className="sprint-today">今天</div>
                    <div className="sprint-action-right">
                        <div className="sprint-view">
                            <div className={`sprint-view-item sprint-view-week ${archiveView === "week" ? "sprint-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                            <div className={`sprint-view-item sprint-view-month ${archiveView === "month" ? "sprint-view-select" : ""}`} onClick={() => changeMonth()}>月</div>
                        </div>

                    </div>

                </div>
                <div>
                    {
                        sprintRoadList && sprintRoadList.length > 0 ? <SprintLineMap
                            sprintLineRef={sprintLineRef}
                            data={sprintRoadList}
                            archiveView={archiveView}
                            graph={graph}
                            setGraph={setGraph}
                            setSprintList={setSprintList}
                        />
                            :
                            <ProjectEmpty description="暂时没有迭代~" />
                    }
                </div>
            </div>
        </Provider>

    )

}

export default withRouter(observer(SprintPage));