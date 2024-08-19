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
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
import { Empty } from "antd";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
const EpicPage = (props) => {
    const store = {
        epicStore: EpicStore,
        workStore: WorkStore
    }
    const { findWorkTypeDmList } = EpicStore;
    const { getWorkConditionPageTree, workList, setWorkList, currentPage,
        totalPage, total, searchCondition, setWorkShowType, setSearchConditionNull,setViewType } = WorkStore;
    // 项目id
    const projectId = props.match.params.id;

    const [workTypeList, setWorkTypeList] = useState();


    const [graph, setGraph] = useState()
    const workAddModel = useRef()
    /**
     * 获取第一级史诗
     */


    useEffect(() => {
        setWorkList([])
        setWorkShowType("lineMap")
        // 设置展示的数据为树形
        setViewType("tree")
        setSearchConditionNull(null).then(res => {
            const values = {
                projectId: projectId,
                workTypeCodes: ["epic", "demand"],
                epicView: true,
                orderParams: [
                    {
                        name: "plan_begin_time",
                        orderType :"asc"
                    }
                ],
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
            getWorkConditionPageTree(values)
        })
       
        findWorkTypeDmList({ projectId: projectId, codes: ["epic", "demand"] }).then(res => {
            if (res.code === 0) {
                setWorkTypeList(res.data)
            }

        })
        return ()=> {
            setSearchConditionNull(null)
        }
    }, [])

    /**
     * 根据史诗名称搜索史诗
     * @param {*} value 
     */
    const onSearch = (value) => {

        getWorkConditionPageTree({ title: value })
    }

    const [archiveView, setArchiveView] = useState("week")
    const changeMonth = () => {
        setArchiveView("month");
        graph.dispose()
    }

    const changePage = () => {
        const values = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition?.pageParam?.currentPage + 1,
            }
        }
        getWorkConditionPageTree(values)
    }
    
    


    return (
        <Provider {...store}>
            <div className="epic">
                <div className="epic-action">
                    <InputSearch
                        placeholder="搜索需求集"
                        allowClear
                        onChange={onSearch}
                    />
                    <div className="epic-action-right">
                        <div className="epic-view">
                            <div className={`epic-view-item epic-view-week ${archiveView === "week" ? "epic-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                            <div className={`epic-view-item epic-view-month ${archiveView === "month" ? "epic-view-select" : ""}`} onClick={() => changeMonth()}>月</div>
                        </div>
                        <WorkCreatDropdown workTypeList={workTypeList}  {...props} modelStyle={{ right: 0 }} />

                    </div>

                </div>
                <>
                    {
                        workList && workList.length > 0 ? <EpicLineMap
                            data={workList}
                            currentPage={currentPage}
                            totalPage={totalPage}
                            total={total}
                            archiveView={archiveView}
                            graph={graph}
                            setGraph={setGraph}
                            changePage={changePage}
                            workTypeList={workTypeList}
                        />
                        :
                        <ProjectEmpty description="暂时没有需求~" />
                    }
                </>

            </div>
        </Provider>

    )

}

export default withRouter(observer(EpicPage));