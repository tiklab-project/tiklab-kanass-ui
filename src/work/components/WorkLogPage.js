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

const WorkLogPage = (props) => {
    const { workInfo, workId, closeModal, searchWorkById } = props;

    const tabValue = [
        {
            label: "动态",
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

    const [selectTab, setSelectTab] = useState(0);

    return(
        <Provider>
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
                                {item.label}
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

                {
                    selectTab === 1 &&
                    <div className="tabs-tabpanel">
                        <WorkComment workId={workId} />
                    </div>
                }

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
            </div>
        </Provider>
    )

}
export default withRouter(WorkLogPage);