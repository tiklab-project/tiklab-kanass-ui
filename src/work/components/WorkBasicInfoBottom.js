import {withRouter} from "react-router";
import {inject, observer, Provider} from "mobx-react";
import React, {useEffect, useState} from "react";
import {Select, Space} from "antd";
import WorkCommentStore from "../store/WorkCommentStore";
import WorkDynamic from "./WorkDynamic";
import WorkLog from "./WorkLog";
import WorkComment from "./WorkComment";
import WorkRelation from "./WorkRelation";
import WorkChild from "./WorkChild";
import WorkRepository from "./WorkDocumentList";
import WorkTestCaseList from "./WorkTestCaseList";
import "./WorkBasicInfoBottom.scss"
import WorkAttachPage from "./WorkAttachPage";

const WorkBasicInfoBottom = (props) => {
    const {workStore, workRelationStore, store, workInfo, workTypeText, deep, setTabValue, taskType, closeModal,getTransitionList,detailTabRef} = props;
    const path = props.match.path;
    const { workId, attachList, searchWorkById, viewType
    } = workStore;
    const { relateAndChildNum } = workRelationStore;
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState("")
    const [selectTab, setSelectTab] = useState(0)
    const {dynamicAndCommentAndLogNum} = WorkCommentStore

    const workDetailBottomTabValue = [
        {
            label: "动态",
            id: 0
        },
        {
            label: "评论",
            id: 1
        },
        {
            label: "子" + workTypeText,// 后面的根据事项类型动态拼接
            id: 2
        },
        {
            label: "关联事项",
            id: 3
        },

        // {
        //     label: "任务",
        //     id: 5
        // },
        {
            label: "测试",
            id: 8
        },
        {
            label: "文档",
            id: 7
        },
        {
            label: "工时",
            id: 6
        },
        {
            label: "附件",
            id: 4
        },

    ]

    const getNum = (id) => {
        switch (id) {
            case 0:
                return dynamicAndCommentAndLogNum.dynamicNum;
            case 1:
                return dynamicAndCommentAndLogNum.commentNum;
            case 6:
                return dynamicAndCommentAndLogNum.workLogNum;
            case 2:
                return relateAndChildNum.relateNum;
            case 3:
                return relateAndChildNum.childNum;
            case 5:
                return relateAndChildNum.taskChildNum;
            case 4:
                return attachList.length;
            default:
                return "";
        }
    }

    const handleTabClick = (id, label) => {
        switch (id) {
            case -1:
                setSelectTab(-1);
                setVisible(true);
                setTitle(label);
                break;
            case -2:
                setSelectTab(-2);
                setVisible(true);
                setTitle(label);
                break;
            case -3:
                setSelectTab(-3);
                setVisible(true);
                setTitle(label);
                break;
            case 0:
                setSelectTab(0)
                setVisible(true);
                setTitle(label);
                break;
            case 1:
                setSelectTab(1)
                setVisible(true);
                setTitle(label);
                break;
            case 2:
                setSelectTab(2)
                setVisible(true);
                setTitle(label);
                break;
            case 3:
                setSelectTab(3)
                setVisible(true);
                setTitle(label);
                break;
            case 4:
                setSelectTab(4)
                setVisible(true);
                setTitle(label);
                break;
            case 5:
                setSelectTab(5)
                setVisible(true);
                setTitle(label);
                break;
            case 6:
                setSelectTab(6)
                setVisible(true);
                setTitle(label);
                break;
            case 7:
                setSelectTab(7)
                setVisible(true);
                setTitle(label);
                break;
            case 8:
                setSelectTab(8)
                setVisible(true);
                setTitle(label);
                break;
            default:
                setSelectTab(null)
                setVisible(false);
                setTitle(label);
                break;
        }
    }

    const handleClear = () => {
        setSelectTab(0)
        // setVisible(false);
        // setTitle("");
    }

    const [finalTabValue, setFinalTabValue] = useState([]);

    useEffect(() => {
        const array = [
            ...workDetailBottomTabValue.filter(item => {
                // 保留其他tab
                if (item.id !== 3 && item.id !== 5) {
                    return true;
                }
                return (
                    (item.id === 3 && deep < 3) ||        // 子事项 deep < 3
                    (item.id === 5 && deep < 3 && workInfo?.workTypeCode === "demand")  // 任务 deep < 3 且 workTypeCode="demand"
                );
            })
        ];
        setFinalTabValue(array);
        console.log(array)
    }, [workId]);
    return <Provider {...store}>
        <div className="work-basic-info-bottom">
            <div className="work-basic-info-bottom-tab">
                {
                    finalTabValue.map((item, index) => {
                        if (index <= 5){
                            return <>
                                <div
                                    key={item.id}
                                    className={"bottom-tab " + (selectTab === item.id ? "bottom-tab-active" : "")}
                                    onClick={() => {
                                        console.log("index:  " + item.id)
                                        setSelectTab(item.id)
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <span className="bottom-tab-num">{getNum(item.id)}</span>
                                </div>
                            </>
                        }
                    })
                }
                {
                    finalTabValue.length > 5 &&
                    <Select
                        bordered={false}
                        // style={{backgroundColor: '#f0f0f0'}}
                        placeholder=""
                        allowClear
                        dropdownMatchSelectWidth={false}
                        className="work-select"
                        key="selectProject"
                        onSelect={handleTabClick}
                        onClear={handleClear}
                        getPopupContainer={() => detailTabRef.current}
                    >
                        {
                            finalTabValue && finalTabValue.map((item, index) => {
                                if (index > 5){
                                    return <Select.Option value={item.id} key={item.id}>
                                        <div
                                            key={item.id}
                                            className={"bottom-tab " + (selectTab === item.id ? "bottom-tab-active" : "")}
                                            onClick={() => {
                                                console.log("index:  " + item.id)
                                                setSelectTab(item.id)
                                            }}
                                        >
                                            <span>{item.label}</span>
                                            <span className="bottom-tab-num">{getNum(item.id)}</span>
                                        </div>
                                    </Select.Option>
                                }
                            })
                        }
                    </Select>
                }
            </div>
            <div className="work-basic-info-bottom-content">
                {
                    selectTab === 0 &&
                    <div className="tabs-tabpanel">
                        <WorkDynamic {...props} />
                    </div>
                }
                {
                    selectTab === 1 &&
                    <div className="tabs-tabpanel">
                        <WorkComment workId={workId} />
                    </div>
                }
                {
                    selectTab === 6 &&
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
                    selectTab === 3 &&
                    <div className="tabs-tabpanel">
                        <WorkRelation projectId={workInfo?.project?.id} {...props} />
                    </div>
                }

                {
                    selectTab === 2 && workInfo.workTypeCode !== "epic" && deep < 3 &&
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
                    selectTab === 2 && workInfo.workTypeCode === "epic" && deep < 3 &&
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
                    selectTab === 5 && workInfo.workTypeCode === "demand" && deep < 3 &&
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
                    selectTab ===4 &&
                    <div className="tabs-tabpanel">
                        <WorkAttachPage {...props}/>
                    </div>
                }
                {
                    selectTab === 7 &&
                    <div className="tabs-tabpanel">
                        <WorkRepository {...props} projectId={workInfo.project.id} />
                    </div>
                }

                {
                    selectTab === 8 &&
                    <div className="tabs-tabpanel">
                        <WorkTestCaseList {...props} projectId={workInfo.project.id} />
                    </div>
                }
            </div>
        </div>
    </Provider>
}

export default withRouter(inject("workStore", "workRelationStore")(observer(WorkBasicInfoBottom)))