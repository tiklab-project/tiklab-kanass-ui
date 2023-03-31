import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Input, Upload, message, Table, DatePicker, Select, Row, Col, Space, Tabs } from "antd";
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import moment from 'moment';
import WorkRelation from "./WorkRelation";
import WorkChild from "./WorkChild";
import WorkLog from "./WorkLog";
import WorkComment from "./WorkComment";
import WorkDynamic from "./WorkDynamic";
import WorkRepository from "./WorkRepository";
import WorkBasicInfoDefect from "./WorkBasicInfoDefect";
import WorkBasicInfoDemand from "./WorkBasicInfoDemand";
import WorkBasicInfoEpic from "./WorkBasicInfoEpic";
import WorkBasicInfoNomal from "./WorkBasicInfoNomal";
import WorkBasicInfoTask from "./WorkBasicInfoTask";

import "./WorkBasicInfo.scss";

const WorkDetailBottom = (props) => {

    const { workStore, workInfo } = props;
    const { workId, workShowType, findTaskWorkType, viewType } = workStore;
    // 富文本内容

    const [workTypeText, setWorkTypeText] = useState("事项")
    const [taskType, setTaskType] = useState()
    const workCode = workInfo.workTypeCode;
    const projectId = props.match.params.id;
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
                        setWorkTypeText("史诗");
                        break;
                    default:
                        setWorkTypeText("事项");
                        break;
                }
            }
        }
        if(workInfo.workTypeCode === "demand"){
            findTaskWorkType({code : "task", projectId: projectId}).then(res => {
                if(res.code === 0){
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
                    return <WorkBasicInfoTask {...props} workInfo={workInfo} />;
                case "demand":
                    return <WorkBasicInfoDemand {...props} workInfo={workInfo} />
                case "defect":
                    return <WorkBasicInfoDefect {...props} workInfo={workInfo} />
                case "epic":
                    return <WorkBasicInfoEpic {...props} workInfo={workInfo} />
                default:
                    return <WorkBasicInfoNomal {...props} workInfo={workInfo} />
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
                            <div className={`tabs-bar ${[6, 7, 8].indexOf(tabValue) !== -1 ? "tabs-bar-select" : ""}`}>{moreTabValue.text}</div>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-downdrop"></use>
                            </svg>
                        </div>

                        <div ref={tabsDropDown} className={`tabs-dropdown ${showMoreTab ? "tabs-dropdown-show" : "tabs-dropdown-hidden"}`}>
                            <div className={`tabs-dropdown-item ${tabValue === 6 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("动态", 6)}>动态</div>
                            <div className={`tabs-dropdown-item ${tabValue === 7 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("评论", 7)}>评论</div>
                            <div className={`tabs-dropdown-item ${tabValue === 8 ? "tabs-dropdown-select" : ""}`} onClick={() => setTabMore("知识库", 8)}>知识库</div>
                        </div>
                    </div>
                </div>
                {
                    workShowType === "list" ? 
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
                                        <WorkRelation type={workTypeText} projectId = {workInfo.project.id} {...props} />
                                    </div>
                                }
                                {
                                    tabValue === 3 &&
                                    <div className="tabs-tabpanel">
                                        <WorkChild
                                            workId={workId}
                                            workType={workInfo.workType}
                                            flow = {workInfo.flow}
                                            viewType={viewType}
                                            treePath={workInfo.treePath}
                                            projectId={workInfo.project.id}
                                            type={`子${workTypeText}`}
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
                                        <WorkRepository {...props} />
                                    </div>
                                }
                            </div>
                        {/* </Col> */}
                    </div>
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
                                <WorkRelation type="需求" {...props} projectId={workInfo.project.id}/>
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
                                <WorkRepository {...props} />
                            </div>
                        }
                    </div>
                }
            </div>
        </Fragment>


    )
};
export default inject("workStore", "workLogStore")(observer(WorkDetailBottom));
