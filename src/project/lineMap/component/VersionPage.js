/*
 * @Descripttion: 版本页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:56:32
 */
import React, { useState, useEffect, useRef } from "react";
import VersionLineMap from "./VersionLineMap";
import "./VersionPage.scss"
import { withRouter } from "react-router";
import { observer, Provider } from "mobx-react";
import LineMapStore from "../store/LineMapStore";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const VersionPage = (props) => {
    const versionLineRef = useRef();
    // 项目id
    const store = {
        lineMapStore: LineMapStore
    }
    const projectId = props.match.params.id;
    const [versionList, setVersionList] = useState([])
    const { findVersionRoadMap, versionRoadList } = LineMapStore;

    const [graph, setGraph] = useState()
    /**
     * 获取第一级史诗
     */


    useEffect(() => {
        findVersionRoadMap(projectId).then((data) => {
            if (data.code === 0) {
                setVersionList(data.data)
            }
        })
        return;
    }, [])




    const [archiveView, setArchiveView] = useState("week")
    const changeMonth = () => {
        setArchiveView("month");
        graph.dispose()
    }
    return (
        <Provider {...store}>
            <div className="version">
                <div className="version-action">
                    <div onClick={() => versionLineRef.current.goToday()} className="version-today">今天</div>
                    <div className="version-action-right">
                        <div className="version-view">
                            <div className={`version-view-item version-view-week ${archiveView === "week" ? "version-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                            <div className={`version-view-item version-view-month ${archiveView === "month" ? "version-view-select" : ""}`} onClick={() => changeMonth()}>月</div>
                        </div>

                    </div>

                </div>
                <div>
                    {
                        versionRoadList && versionRoadList.length > 0 ? <VersionLineMap
                            versionLineRef={versionLineRef}
                            data={versionRoadList}
                            archiveView={archiveView}
                            graph={graph}
                            setGraph={setGraph}
                        />
                        :
                        <ProjectEmpty description="暂时没有版本~" />
                    }
                </div>
            </div>
        </Provider>

    )

}

export default withRouter(observer(VersionPage));