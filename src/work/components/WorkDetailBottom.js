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
    const { workStore, workInfo, setWorkInfo } = props;
    const { workId, workShowType, findTaskWorkType, viewType } = workStore;
    // 富文本内容

    const [workTypeText, setWorkTypeText] = useState("事项")
    const [taskType, setTaskType] = useState()
    const workCode = workInfo.workTypeCode;
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
            findTaskWorkType({ code: "task", projectId: workInfo.project.id }).then(res => {
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
    }

    const deatilType = () => {
        if (workInfo?.workTypeCode) {
            switch (workInfo?.workTypeCode) {
                case "task":
                    return <WorkBasicInfoTask {...props} workInfo={workInfo} setWorkInfo={setWorkInfo} />;
                case "demand":
                case "epic":
                    return <WorkBasicInfoDemand {...props} workInfo={workInfo} setWorkInfo={setWorkInfo} />
                case "defect":
                    return <WorkBasicInfoDefect {...props} workInfo={workInfo} setWorkInfo={setWorkInfo} />
                default:
                    return <WorkBasicInfoNomal {...props} workInfo={workInfo} setWorkInfo={setWorkInfo} />
            }
        }
    }

    return (
        <Fragment>
            <div className="workitem-tab">
                <div className="workitem-tabs">
                    <div className={`tabs-bar ${tabValue === 1 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(1)} >详细信息</div>
                    <div className={`tabs-bar ${tabValue === 2 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(2)}>关联事项</div>
                    <div className={`tabs-bar ${tabValue === 3 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(3)}>子{workTypeText}</div>
                    {
                        workCode === "demand" && <div className={`tabs-bar ${tabValue === 4 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(4)}>任务</div>
                    }
                    <div className={`tabs-bar ${tabValue === 5 ? "tabs-bar-select" : ""}`} onClick={() => setTabValue(5)}>工时</div>

                    <div className="tabs-more">
                        <div className="tabs-more-button" onClick={() => setShowMoreTab(true)}>
                            <div className={`tabs-bar ${[6, 7, 8, 9].indexOf(tabValue) !== -1 ? "tabs-bar-select" : ""}`}>{moreTabValue.text}</div>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-downdrop"></use>
                            </svg>
                        </div>

                        <div ref={tabsDropDown} className={`tabs-dropdown ${showMoreTab ? "tabs-dropdown-show" : "tabs-dropdown-hidden"}`}>
                            <div className={`tabs-dropdown-item ${tabValue === 6 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("动态", 6)}>动态</div>
                            <div className={`tabs-dropdown-item ${tabValue === 7 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("评论", 7)}>评论</div>
                            <div className={`tabs-dropdown-item ${tabValue === 8 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("文档", 8)}>文档</div>
                            <div className={`tabs-dropdown-item ${tabValue === 9 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("测试用例", 9)}>测试用例</div>
                        </div>
                    </div>
                </div>
                <div className="workitem-detail-row">
                    {/* <Col xl={{ span: "24" }} xxl={{ span: "18", offset: "3" }} lg={{span: "24"}}> */}
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
                            tabValue === 3 && workInfo.workTypeCode !== "epic" &&
                            <div className="tabs-tabpanel">
                                <WorkChild
                                    workId={workId}
                                    workType={workInfo.workType}

                                    flow={workInfo.flow}
                                    viewType={viewType}
                                    treePath={workInfo.treePath}
                                    projectId={workInfo.project.id}
                                    type={`子${workTypeText}`}
                                    {...props}
                                />
                            </div>
                        }
                        {
                            tabValue === 3 && workInfo.workTypeCode === "epic" &&
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
                            tabValue === 4 && workCode === "demand" &&
                            <div className="tabs-tabpanel">
                                <WorkChild
                                    workId={workId}
                                    workType={taskType}
                                    treePath={workInfo.treePath}
                                    projectId={workInfo.project.id}
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
                    {/* </Col> */}
                </div>
                {/* {
                    workShowType === "list" ?
                        
                        :
                        <div className="workitem-tabs-content workitem-detail-row">
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
                                    <WorkRelation type="需求" {...props} projectId={workInfo?.project?.id} />
                                </div>
                            }
                            {
                                tabValue === 3 &&
                                <div className="tabs-tabpanel">
                                    <WorkChild
                                        workId={workId}
                                        workType={workInfo.workType}
                                        viewType={viewType}
                                        treePath={workInfo.treePath}
                                        projectId={workInfo.project.id}
                                        type={`子${workTypeText}`}
                                        {...props}
                                    />
                                </div>
                            }
                            {
                                tabValue === 4 &&
                                <div className="tabs-tabpanel">
                                    <WorkChild
                                        workId={workId}
                                        workType={taskType}
                                        treePath={workInfo.treePath}
                                        projectId={workInfo.project.id}
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
                } */}
            </div>
        </Fragment>


    )
};
export default inject("workStore")(observer(WorkDetailBottom));
