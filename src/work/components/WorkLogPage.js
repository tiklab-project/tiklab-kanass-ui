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
            <div className="log-page">

                <div className="log-page-content">
                    <WorkDynamic {...props} />

                    <WorkLog
                        closeModal = {closeModal}
                        surplusTime={workInfo.surplusTime}
                        workInfo={workInfo}
                        planTakeupTime={workInfo.planTakeupTime}
                        searchWorkById = {searchWorkById}
                        {...props}
                    />

                    <WorkComment workId={workId} />
                </div>

            </div>
        </Provider>
    )

}
export default withRouter(WorkLogPage);