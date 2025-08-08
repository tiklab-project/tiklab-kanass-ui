import React from "react";
import PlanCaseInstanceListCommon from "./PlanCaseInstanceListCommon";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";

const ApiUnitInstanceListPlan = (props) => {
    const {caseId,testPlanId} =props

    return(
        <>

            <PlanCaseInstanceListCommon
                type={CASE_TYPE.API_UNIT}
                caseId={caseId}
                testPlanId={testPlanId}
            />

        </>
    )
}

export default ApiUnitInstanceListPlan;