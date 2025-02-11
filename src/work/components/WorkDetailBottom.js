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
import WorkRelation from "./WorkRelation";
import WorkChild from "./WorkChild";
import WorkLog from "./WorkLog";
import WorkComment from "./WorkComment";
import WorkDynamic from "./WorkDynamic";
import WorkRepository from "./WorkDocumentList";
import WorkBasicInfoDefect from "./WorkBasicInfoDefect";
import WorkBasicInfoDemand from "./WorkBasicInfoDemand";
import WorkBasicInfoNomal from "./WorkBasicInfoNomal";
import WorkBasicInfoTask from "./WorkBasicInfoTask";
import WorkTestCaseList from "./WorkTestCaseList";
import "./WorkDetailBottom.scss";

const WorkDetailBottom = (props) => {
    const { workStore, workInfo, setWorkInfo,  detailForm, getTransitionList, 
        tabValue, setTabValue, closeModal } = props;
    const treePath = workInfo.treePath;
    const deep = treePath ? treePath.split(";").length : 1;
    const { workId, findDmWorkTypeByCode, viewType, searchWorkById } = workStore;
    // 富文本内容
    
    // 事项类型     
    const [workTypeText, setWorkTypeText] = useState("事项")
    // 任务类型
    const [taskType, setTaskType] = useState()
    // 事项类型编码
    const workTypeCode = workInfo.workTypeCode;

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
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                    />;
                case "demand":
                case "epic":
                    return <WorkBasicInfoDemand
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                    />
                case "defect":
                    return <WorkBasicInfoDefect
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                    />
                default:
                    return <WorkBasicInfoNomal
                        {...props}
                        workInfo={workInfo}
                        setWorkInfo={setWorkInfo}
                        detailForm={detailForm}
                        getTransitionList={getTransitionList}
                    />
            }
        }
    }

  
    return (
        <div className="workitem-detail-row">
            <div className="workitem-tabs-content">
                {
                    tabValue === 1 &&
                    <div className="tabs-tabpanel">
                        {
                            workInfo && deatilType()
                        }
                    </div>
                }
                {
                    tabValue === 2 &&
                    <div className="tabs-tabpanel">
                        <WorkRelation projectId={workInfo?.project?.id} {...props} />
                    </div>
                }
                {
                    tabValue === 3 && workInfo.workTypeCode !== "epic" && deep < 3 &&
                    <div className="tabs-tabpanel">
                        <WorkChild
                            workId={workId}
                            workType={workInfo.workType}
                            flow={workInfo.flow}
                            viewType={viewType}
                            treePath={workInfo.treePath}
                            projectId={workInfo.project.id}
                            type={`子${workTypeText}`}
                            workStatusNodeId={workInfo?.workStatusNode?.id}
                            getTransitionList={getTransitionList}
                            setTabValue = {setTabValue}
                            {...props}
                        />
                    </div>
                }
                {
                    tabValue === 3 && workInfo.workTypeCode === "epic" && deep < 3 &&
                    <div className="tabs-tabpanel">
                        <WorkChild
                            workId={workId}
                            workType={workInfo.workType}
                            workTypeCode={workInfo.workTypeCode}
                            flow={workInfo.flow}
                            viewType={viewType}
                            treePath={workInfo.treePath}
                            projectId={workInfo.project.id}
                            type={`${workTypeText}`}
                            {...props}
                        />
                    </div>
                }
                {
                    tabValue === 4 && workTypeCode === "demand" && deep < 3 &&
                    <div className="tabs-tabpanel">
                        <WorkChild
                            workId={workId}
                            workType={taskType}
                            treePath={workInfo.treePath}
                            projectId={workInfo.project.id}
                            workInfo={workInfo}
                            type="任务"
                            {...props}
                        />
                    </div>
                }
                {
                    tabValue === 5 &&
                    <div className="tabs-tabpanel">
                        <WorkLog 
                            closeModal = {closeModal} 
                            surplusTime={workInfo.surplusTime} 
                            workInfo={workInfo} 
                            planTakeupTime={workInfo.planTakeupTime} 
                            searchWorkById = {searchWorkById}
                            {...props} 
                        />
                    </div>
                }
                {
                    tabValue === 6 &&
                    <div className="tabs-tabpanel">
                        <WorkDynamic {...props} />
                    </div>
                }
                {
                    tabValue === 7 &&
                    <div className="tabs-tabpanel">
                        <WorkComment workId={workId} />
                    </div>
                }
                {
                    tabValue === 8 &&
                    <div className="tabs-tabpanel">
                        <WorkRepository {...props} projectId={workInfo.project.id} />
                    </div>
                }
                {
                    tabValue === 9 &&
                    <div className="tabs-tabpanel">
                        <WorkTestCaseList {...props} projectId={workInfo.project.id} />
                    </div>
                }
            </div>
        </div>
    )
};
export default inject("workStore")(observer(WorkDetailBottom));
