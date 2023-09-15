/*
 * @Descripttion: 史诗页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect, useRef } from "react";
import VersionLineMap from "./VersionLineMap";
import InputSearch from "../../../common/input/InputSearch";
import "./VersionPage.scss"
import { withRouter } from "react-router";
import { observer, Provider } from "mobx-react";
import LineMapStore from "../store/LineMapStore";
const VersionPage = (props) => {
    // 项目id
    const store = {
        lineMapStore: LineMapStore
    }
    const projectId = props.match.params.id;
    const [versionList, setVersionList] = useState([])
    const { findVersionRoadMap, } = LineMapStore;

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
    }, [])

    /**
     * 根据史诗名称搜索史诗
     * @param {*} value 
     */
    const onSearch = (value) => {

        getWorkConditionPageTree({title: value}).then(res => {
            console.log(versionList)
        })
    }


    const [archiveView, setArchiveView] = useState("week")
    const changeMonth = () => {
        setArchiveView("month"); 
        console.log("oopt")
        console.log(graph)
        graph.dispose()
    }
    return (
        <Provider {...store}>
            <div className="version">
                <div className="version-action">
                    {/* <InputSearch
                        placeholder="版本名字"
                        allowClear
                        style={{ width: 300 }}
                        onChange={onSearch}
                    /> */}
                    <div></div>
                    <div className="version-action-right">
                    <div className="version-view">
                        <div className={`version-view-item version-view-week ${archiveView === "week" ? "version-view-select": "" }`} onClick={() => setArchiveView("week")}>周</div>
                        <div className={`version-view-item version-view-month ${archiveView === "month" ? "version-view-select": "" }`}  onClick={() => changeMonth() }>月</div>
                    </div>   
                    
                    </div>
                    
                </div>
                <div>
                    {
                        versionList && <VersionLineMap  
                        data={versionList} 
                        archiveView= {archiveView}
                        graph = {graph}
                        setGraph = {setGraph}
                        />
                    }
                </div>
            </div>
        </Provider>

    )

}

export default withRouter(observer(VersionPage));