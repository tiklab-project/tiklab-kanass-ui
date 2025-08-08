import React, {useEffect} from "react";
import {observer} from "mobx-react";
import InstanceListCommon from "../../../testreport/common/InstanceListCommon";
import {CASE_TYPE} from "../../../common/dictionary/dictionary";
import {findCaseInstancePage} from "../../../testreport/common/instanceCommonFn";


const TestReportInstanceListCommon = (props) =>{
    const {startTime,endTime,belongId,planReport,toInstanceDetailFn} = props
    const projectId = localStorage.getItem('projectId')

    useEffect(async()=>{
        await findCaseInstancePage(
            null,
            "test-plan",
            {
                projectId:projectId,
                startTime:startTime,
                endTime:endTime,
                belongId:belongId
            }
        );
    },[startTime,endTime])


    return(
        <InstanceListCommon
            type={CASE_TYPE.TEST_REPORT}
            belongId={belongId}
            planReport={planReport}
            toInstanceDetailFn={toInstanceDetailFn}
            {...props}
        />

    )
}

export default observer(TestReportInstanceListCommon);