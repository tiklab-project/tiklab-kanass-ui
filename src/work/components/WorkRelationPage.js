/**
 * 关联事项子tab页 包含 关联事项 子事项 页面
 */
import {withRouter} from "react-router";
import {Provider} from "mobx-react";
import WorkRelationStore from "../store/WorkRelationStore";
import React, {useState} from "react";
import WorkRelation from "./WorkRelation";
import WorkChild from "./WorkChild";
import "./WorkRelationPage.scss"

const WorkRelationPage = (props) => {
    const store = {
        workRelation: WorkRelationStore,
        workStore: props.workStore
    }
    const { workInfo, workTypeText, deep, workId, getTransitionList, setTabValue, viewType, taskType } = props;

    const tabValue = [
        {
            label: "关联事项",
            id: 0
        },
        {
            label: "子" + workTypeText,// 后面的根据事项类型动态拼接
            id: 1
        },
        {
            label: "任务",
            id: 2
        }
    ]

    const [selectTab, setSelectTab] = useState(0);

    return(
        <Provider {...store}>
            <div className="relation-page-top">
                {
                    tabValue.map((item, index) => {
                        if (item.id !== 1 || (item.id === 1 && deep < 3)) {
                            return (
                                <div
                                    key={item.id}
                                    className={`relation-page-tab ${selectTab === index ? "relation-page-tab-active" : ""}`}
                                    onClick={() => {
                                        setSelectTab(index);
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        }
                        if (item.id === 2 && deep < 3 && workInfo.workTypeCode === "demand"){
                            return (
                                <div
                                    key={item.id}
                                    className={`relation-page-tab ${selectTab === index ? "relation-page-tab-active" : ""}`}
                                    onClick={() => {
                                        setSelectTab(index);
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        }
                        return null;
                    })
                }
            </div>
            <div className="relation-page-content">
                {
                    selectTab === 0 &&
                    <div className="tabs-tabpanel">
                        <WorkRelation projectId={workInfo?.project?.id} {...props} />
                    </div>
                }

                {
                    selectTab === 1 && workInfo.workTypeCode !== "epic" && deep < 3 &&
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
                    selectTab === 1 && workInfo.workTypeCode === "epic" && deep < 3 &&
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
                    selectTab === 2 && workInfo.workTypeCode === "demand" && deep < 3 &&
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
            </div>
        </Provider>
    )

}
export default withRouter(WorkRelationPage);