import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import React, {useState} from "react";
import FunctionInstanceList from "./FunctionInstanceList";
import WorkItemBindList from "../../../defectBind/defect/components/CaseBindDefectList";

const FunctionDetailBottom = (props) => {
    const { store, testPlanId, caseId } = props;
    const functionId = caseId;
    const [selectTab, setSelectTab] = useState( testPlanId ? 0 : 1);
    const bottomTabValue = [
        {
            label: "关联缺陷",
            id: 0
        },
        {
            label: "执行结果",
            id: 1
        }
    ]


    return (
        <Provider {...store}>
            <div className="work-basic-info-bottom">
                <div className="work-basic-info-bottom-tab">
                    {
                        bottomTabValue.map((item, index) => {
                            if (item.id !== 0 || testPlanId){
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
                                    </div>
                                </>
                            }
                        })
                    }
                </div>
                <div className="work-basic-info-bottom-content">
                    {
                        selectTab === 0 &&
                        <div className="tabs-tabpanel">
                            <WorkItemBindList
                                caseId={functionId}
                                testPlanId={testPlanId}
                                inDetail={true}
                            />
                        </div>
                    }
                    {
                        selectTab === 1 &&
                        <div className="tabs-tabpanel">
                            <FunctionInstanceList caseId={caseId} />
                        </div>
                    }

                </div>
            </div>
        </Provider>
    )
}

export default withRouter((observer(FunctionDetailBottom)));