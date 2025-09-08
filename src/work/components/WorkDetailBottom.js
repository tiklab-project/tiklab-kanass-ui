/*
 * @Descripttion: 事项详情tab 部分
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:44
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkBasicInfoDefect from "./WorkBasicInfoDefect";
import WorkBasicInfoDemand from "./WorkBasicInfoDemand";
import WorkBasicInfoNomal from "./WorkBasicInfoNomal";
import WorkBasicInfoTask from "./WorkBasicInfoTask";
import "./WorkDetailBottom.scss";
import WorkRelationPage from "./WorkRelationPage";
import WorkLogPage from "./WorkLogPage";
import WorkLinkPage from "./WorkLinkPage";
import {withRouter} from "react-router";
import WorkRelationStore from "../store/WorkRelationStore";
import WorkCommentStore from "../store/WorkCommentStore";

const WorkDetailBottom = (props) => {
    const { workStore, workInfo, setWorkInfo,  detailForm, getTransitionList, 
        tabValue, setTabValue, closeModal, workDetailMetaData, setWorkDetailMetaData, viewFlow } = props;
    const treePath = workInfo.treePath;
    const deep = treePath ? treePath.split(";").length : 1;
    const { workId, findDmWorkTypeByCode, viewType, searchWorkById } = workStore;
    const { findWorkRelateAndChildNum } = WorkRelationStore
    const { findWorkDynamicAndCommentAndLogNum } = WorkCommentStore
    // 富文本内容
    
    // 事项类型     
    const [workTypeText, setWorkTypeText] = useState("事项")
    // 任务类型
    const [taskType, setTaskType] = useState()
    // 事项类型编码
    const workTypeCode = workInfo.workTypeCode;

    const path = props.match.path;

    useEffect(() => {
        // 获取关联事项、子事项记录个数
        findWorkRelateAndChildNum(workId);
        // 获取动态、评论、工时记录个数
        findWorkDynamicAndCommentAndLogNum(workId);
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

        // 如果当前是需求类型，获取任务的文本
        if (workInfo.workTypeCode === "demand") {
            findDmWorkTypeByCode({ code: "task", projectId: workInfo.project.id }).then(res => {
                if (res.code === 0) {
                    setTaskType(res.data)
                }
            })
        }
        return
    }, [workInfo])

    /**
     * 根据事项类型编码，渲染相应的事项详情
     */
    const deatilType = () => {
        if (workInfo?.workTypeCode) {
            switch (workInfo?.workTypeCode) {
                case "task":
                    return <WorkBasicInfoTask
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        workDetailMetaData={workDetailMetaData}
                        setWorkDetailMetaData={setWorkDetailMetaData}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                        deep={deep}
                        taskType={taskType}
                        workTypeText={workTypeText}
                        workRelationStore={WorkRelationStore}
                        viewFlow={viewFlow}
                    />;
                case "demand":
                case "epic":
                    return <WorkBasicInfoDemand
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        workDetailMetaData={workDetailMetaData}
                        setWorkDetailMetaData={setWorkDetailMetaData}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                        deep={deep}
                        taskType={taskType}
                        workTypeText={workTypeText}
                        workRelationStore={WorkRelationStore}
                        viewFlow={viewFlow}
                    />
                case "defect":
                    return <WorkBasicInfoDefect
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        workDetailMetaData={workDetailMetaData}
                        setWorkDetailMetaData={setWorkDetailMetaData}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                        deep={deep}
                        taskType={taskType}
                        workTypeText={workTypeText}
                        workRelationStore={WorkRelationStore}
                        viewFlow={viewFlow}
                    />
                default:
                    return <WorkBasicInfoNomal
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        workDetailMetaData={workDetailMetaData}
                        setWorkDetailMetaData={setWorkDetailMetaData}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                        deep={deep}
                        taskType={taskType}
                        workTypeText={workTypeText}
                        workRelationStore={WorkRelationStore}
                        viewFlow={viewFlow}
                    />
            }
        }
    }

  
    return (
        <div className="workitem-detail-row">
            <div className="workitem-tabs-content">
                {
                    tabValue === 1 &&
                    // <div className="tabs-tabpanel">
                    <>
                        {
                            workInfo && deatilType()
                        }
                    </>
                    // </div>
                }
                {
                    tabValue === 2 && path !== "/project/:id/appraised/:appraised" &&
                    <>
                        <WorkLogPage
                            searchWorkById={searchWorkById}
                            workId={workId}
                            {...props}
                        />
                    </>
                }
                {
                    tabValue === 3 &&
                    <WorkRelationPage
                        workTypeText={workTypeText}
                        deep={deep}
                        viewType={viewType}
                        taskType = {taskType}
                        workId={workId}
                        workRelationStore={WorkRelationStore}
                        {...props} />
                }
                {
                    tabValue === 4 && path !== "/project/:id/appraised/:appraised" &&
                    <WorkLinkPage
                        workId={workId}
                        {...props}
                    />
                }
            </div>
        </div>
    )
};
export default withRouter(inject("workStore")(observer(WorkDetailBottom)));
