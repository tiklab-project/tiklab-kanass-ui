import React from "react";
import TestPlanBindCaseInstanceTable from "../../instance/components/testPlanBindCaseInstanceTable";
import CaseBread from "../../../common/CaseBread";
import PageCenter from "../../../common/pageContent/PageCenter";
import testReportStore from "../store/testReportStore";

const PlanReportInstanceDetail = (props) =>{
    const {testReportInfo} = testReportStore
    const projectId = localStorage.getItem('projectId')

    return(
        <PageCenter>
            <div className={"content-box-center"}>
                <CaseBread
                    router={`/plan/${projectId}/reportDetail`}
                    breadItem={["测试报告",testReportInfo?.name,"报告详情"]}
                />
                <TestPlanBindCaseInstanceTable  {...props}/>
            </div>
        </PageCenter>
    )
}

export default PlanReportInstanceDetail;