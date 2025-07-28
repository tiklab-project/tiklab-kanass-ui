/**
 * 关联事项子tab页 包含 关联事项 子事项 页面
 */
import {withRouter} from "react-router";
import {Provider} from "mobx-react";
import React, {useState} from "react";
import "./WorkLogPage.scss"
import WorkDynamic from "./WorkDynamic";
import WorkComment from "./WorkComment";
import WorkLog from "./WorkLog";
import WorkCommentStore from "../store/WorkCommentStore";

const WorkLogPage = (props) => {
    const { workInfo, workId, closeModal, searchWorkById } = props;
    const {dynamicAndCommentAndLogNum} = WorkCommentStore
    const tabValue = [
        {
            label: "所有",
            id: 0
        },
        {
            label: "评论",
            id: 1
        },
        {
            label: "工时",
            id: 2
        }
    ]

    const getNum = (id) => {
        switch (id) {
            case 0:
                return dynamicAndCommentAndLogNum.dynamicNum;
            case 1:
                return dynamicAndCommentAndLogNum.commentNum;
            case 2:
                return dynamicAndCommentAndLogNum.workLogNum;
            default:
                return 0;
        }
    }

    const [selectTab, setSelectTab] = useState(0);

    return(
        <Provider>
            <div className="log-page">

                <div className="log-page-top">
                    {
                        tabValue.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={"log-page-tab " + (selectTab === index ? "log-page-tab-active" : "")}
                                    onClick={() => {
                                        console.log("index:  " + index)
                                        setSelectTab(index)
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <span className="log-page-tab-num">{getNum(item.id)}</span>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="log-page-content">
                    {
                        selectTab === 0 &&
                        <div className="tabs-tabpanel">
                            <WorkDynamic {...props} />
                        </div>
                    }
                    {/*<WorkDynamic {...props} />*/}


                    {
                        selectTab === 2 &&
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

                    {/*<WorkLog*/}
                    {/*    closeModal = {closeModal}*/}
                    {/*    surplusTime={workInfo.surplusTime}*/}
                    {/*    workInfo={workInfo}*/}
                    {/*    planTakeupTime={workInfo.planTakeupTime}*/}
                    {/*    searchWorkById = {searchWorkById}*/}
                    {/*    {...props}*/}
                    {/*/>*/}

                    {
                        selectTab === 1 &&
                        <div className="tabs-tabpanel">
                            <WorkComment workId={workId} />
                        </div>
                    }
                    {/*<WorkComment workId={workId} />*/}
                </div>

            </div>
        </Provider>
    )

}
export default withRouter(WorkLogPage);