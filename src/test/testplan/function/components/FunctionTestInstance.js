import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import functionTestReportStore from "../store/functionTestReportStore";
import FunctionInstanceCommon from "./FunctionInstanceCommon";
const {getFunctionTestReport} = functionTestReportStore

const FunctionTestInstance = (props) => {
    const {testPlanStore} = props;

    const {findTestPlan} = testPlanStore;
    const testPlanId = sessionStorage.getItem('testPlanId')
    const [planInfo, setPlanInfo] = useState({});

    const [reportInfo, setReportInfo] = useState({});

    useEffect(async () => {
        let planInfo = await findTestPlan(testPlanId)
        setPlanInfo(planInfo)
    }, [testPlanId]);

    useEffect(async ()=>{
        let reportInfo = await getFunctionTestReport(testPlanId)
        setReportInfo(reportInfo)
    },[testPlanId])



    return (
        // <PageCenter>
        //     <div className={"content-box-center"}>
        //         <div className={"header-box-space-between"}>
        //             <div className={'header-box-title'}>测试历史</div>
        //         </div>
                <div className="function-test-report">
                    <FunctionInstanceCommon
                        planInfo={planInfo}
                        reportInfo={reportInfo}
                    />
                </div>
        //     </div>
        // </PageCenter>
    );
};

export default inject('testPlanStore')(observer(FunctionTestInstance));