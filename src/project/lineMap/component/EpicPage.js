/*
 * @Descripttion: 史诗页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect, useRef } from "react";
import Button from "../../../common/button/Button";
import EpicLineMap from "./EpicLineMap";
import InputSearch from "../../../common/input/InputSearch";
import WorkAddModel from "../../../work/components/WorkAddModel"
import "./Epic.scss"
import { withRouter } from "react-router";
import { observer, Provider } from "mobx-react";
import EpicStore from '../store/EpicStore';
import WorkStore from "../../../work/store/WorkStore";
const EpicPage = (props) => {
    const store = {
        epicStore: EpicStore,
        workStore: WorkStore
    }
    const { findDmWorkTypeByCode } = EpicStore;
    const { getWorkConditionPageTree, workList } = WorkStore;
    // 项目id
    const projectId = props.match.params.id;

    const [epicTypeInfo, setEpicTypeInfo] = useState();


    const [graph, setGraph] = useState()
    const workAddModel = useRef()
    /**
     * 获取第一级史诗
     */


    useEffect(() => {
        getWorkConditionPageTree({ projectId: projectId, workTypeCode: "epic", epicView: true })
        findDmWorkTypeByCode({ projectId: projectId, code: "epic" }).then(res => {
            if(res.code === 0){
                setEpicTypeInfo(res.data)
            }
            
        })
    }, [])

    /**
     * 根据史诗名称搜索史诗
     * @param {*} value 
     */
    const onSearch = (value) => {

        getWorkConditionPageTree({title: value}).then(res => {
            console.log(workList)
        })
    }

    /**
     * 添加史诗
     */
    const addEpic = () => {
        // setShowEpicAddModal(true)
        // setAddChild("father")
        // setParentId(null)
        workAddModel.current.setShowAddModel(true)
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
            <div className="epic">
                <div className="epic-action">
                    <InputSearch
                        placeholder="需求集名字"
                        allowClear
                        style={{ width: 300 }}
                        onChange={onSearch}
                    />
                    <div className="epic-action-right">
                    <div className="epic-view">
                        <div className={`epic-view-item epic-view-week ${archiveView === "week" ? "epic-view-select": "" }`} onClick={() => setArchiveView("week")}>周</div>
                        <div className={`epic-view-item epic-view-month ${archiveView === "month" ? "epic-view-select": "" }`}  onClick={() => changeMonth() }>月</div>
                    </div>   
                     <Button type="primary" onClick={() => addEpic()}>
                        添加需求集
                    </Button>
                    
                    </div>
                    
                </div>
                <div>
                    {
                        workList && <EpicLineMap  
                        data={workList} 
                        archiveView= {archiveView}
                        graph = {graph}
                        setGraph = {setGraph}
                        />
                    }
                </div>
                <WorkAddModel workAddModel={workAddModel} workType={epicTypeInfo} {...props} />

            </div>
        </Provider>

    )

}

export default withRouter(observer(EpicPage));