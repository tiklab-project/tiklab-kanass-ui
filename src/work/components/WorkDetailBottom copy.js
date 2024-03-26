import React, { useEffect, useState, useRef, Fragment } from "react";
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
import "./WorkBasicInfo.scss";

const WorkDetailBottom = (props) => {
    const { workStore, workInfo, setWorkInfo, relationModalNum, detailForm, getTransitionList } = props;
    const treePath = workInfo.treePath;
    const deep = treePath ? treePath.split(";").length : 1;
    const { workId, workShowType, findDmWorkTypeByCode, viewType } = workStore;
    // 富文本内容

    const [workTypeText, setWorkTypeText] = useState("事项")
    const [taskType, setTaskType] = useState()
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
        if (workInfo.workTypeCode === "demand") {
            findDmWorkTypeByCode({ code: "task", projectId: workInfo.project.id }).then(res => {
                if (res.code === 0) {
                    setTaskType(res.data)
                }
            })
        }
        setEditorType(false)
        return
    }, [workInfo])



    // 转换描述编辑模式setEditorType
    const [editorType, setEditorType] = useState(false);

    const [tabValue, setTabValue] = useState(1);
    const [moreTabValue, setMoreTabValue] = useState({ value: 6, text: "动态" });
    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [setShowMoreTab])

    const closeModal = (e) => {
        if (!tabsDropDown.current) {
            return;
        }
        if (!tabsDropDown.current.contains(e.target) && tabsDropDown.current !== e.target) {
            setShowMoreTab(false)
        }
    }

    const setTabMore = (text, value) => {
        setTabValue(value)
        setMoreTabValue({ value: value, text: text })
        setShowMoreTab(false)
        setMoreTabsNum(value)
    }

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
    return (
        <div className="workitem-tab">
            <div className="workitem-tabs">
                <div className={`tabs-bar ${tabValue === 1 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(1)} >详细信息</div>
                <div className={`tabs-bar ${tabValue === 2 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(2)}>
                    关联事项
                    <span className="tabs-bar-num">{relationModalNum?.relationWork}</span>
                </div>
                {
                    deep < 3 && <>
                        <div className={`tabs-bar ${tabValue === 3 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(3)}>
                            子{workTypeText}
                            <span className="tabs-bar-num">{relationModalNum?.childrenWork}</span>
                        </div>
                        {
                            workTypeCode === "demand" && <div className={`tabs-bar ${tabValue === 4 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(4)}>
                                任务
                                <span className="tabs-bar-num">{relationModalNum?.childrenTaskWork}</span>
                            </div>
                        }
                    </>
                }

                <div className={`tabs-bar ${tabValue === 5 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(5)}>
                    工时
                    <span className="tabs-bar-num">{relationModalNum?.workLog}</span>
                </div>
                <div className={`tabs-bar ${tabValue === 6 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(6)}>
                    动态
                    <span className="tabs-bar-num">{relationModalNum?.dynamic}</span>
                </div>
                <div className="tabs-more">
                    <div className="tabs-more-button" >
                        <svg className="svg-icon" aria-hidden="true" onClick={() => setShowMoreTab(true)}>
                            <use xlinkHref="#icon-more"></use>
                        </svg>
                    </div>

                    <div ref={tabsDropDown} className={`tabs-dropdown ${showMoreTab ? "tabs-dropdown-show" : "tabs-dropdown-hidden"}`}>

                        <div className={`tabs-dropdown-item ${tabValue === 7 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("评论", 7)}>
                            评论
                            <span className="tabs-bar-num">{relationModalNum?.workComment}</span>
                        </div>
                        <div className={`tabs-dropdown-item ${tabValue === 8 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("文档", 8)}>
                            文档
                            <span className="tabs-bar-num">{relationModalNum?.workDoucment}</span>
                        </div>
                        <div className={`tabs-dropdown-item ${tabValue === 9 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("测试用例", 9)}>
                            测试用例
                            <span className="tabs-bar-num">{relationModalNum?.workTestCase}</span>
                        </div>
                    </div>
                </div>
            </div>
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
                            <WorkRelation type={workTypeText} projectId={workInfo?.project?.id} {...props} />
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
                            <WorkLog surplusTime={workInfo.surplusTime} planTakeupTime={workInfo.planTakeupTime} {...props} />
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

        </div>
    )
};
export default inject("workStore")(observer(WorkDetailBottom));
