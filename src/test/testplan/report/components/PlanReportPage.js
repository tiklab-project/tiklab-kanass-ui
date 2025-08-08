import React from "react";
import TestReportPageCommon from "../common/TestReportPageCommon";
import TestReportEdit from "../components/TestReportEdit";

const PlanReportPage = (props) => {

    const testPlanId = sessionStorage.getItem('testPlanId');
    const projectId = localStorage.getItem('projectId');

    // 去往详情页
    const toReportDetail = (record) => {
        sessionStorage.setItem('testReportId', record.id);
        props.history.push(`/project/${projectId}/testcase/planDetail/reportDetail`);
    };

    return (
        // <PageCenter>
        //     <div className={"content-box-center"}>
                <TestReportPageCommon
                    toDetailFn={toReportDetail}
                    TestReportEdit={TestReportEdit}
                    testPlanId={testPlanId}
                />
        //     </div>
        // </PageCenter>
    );
}

export default PlanReportPage;