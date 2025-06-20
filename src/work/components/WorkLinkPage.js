/**
 * 关联事项子tab页 包含 关联事项 子事项 页面
 */
import {withRouter} from "react-router";
import {Provider} from "mobx-react";
import React, {useState} from "react";
import "./WorkLinkPage.scss"
import WorkLog from "./WorkLog";
import WorkRepository from "./WorkDocumentList";
import WorkTestCaseList from "./WorkTestCaseList";

const WorkLogPage = (props) => {
    const { workInfo, workId, closeModal, searchWorkById } = props;

    const tabValue = [
        {
            label: "文档",
            id: 0
        },
        {
            label: "测试用例",
            id: 1
        }
    ]

    const [selectTab, setSelectTab] = useState(0);

    return(
        <Provider>
            <div className="link-page-top">
                {
                    tabValue.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={"link-page-tab " + (selectTab === index ? "link-page-tab-active" : "")}
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
            <div className="link-page-content">
                {
                    selectTab === 0 &&
                    <div className="tabs-tabpanel">
                        <WorkRepository {...props} projectId={workInfo.project.id} />
                    </div>
                }

                {
                    selectTab === 1 &&
                    <div className="tabs-tabpanel">
                        <WorkTestCaseList {...props} projectId={workInfo.project.id} />
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