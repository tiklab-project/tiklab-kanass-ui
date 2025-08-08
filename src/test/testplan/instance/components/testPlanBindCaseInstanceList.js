import React, {useEffect} from "react";
import TestPlanBindCaseInstanceTable from "./testPlanBindCaseInstanceTable";
import CaseBread from "../../../common/CaseBread";
import PageCenter from "../../../common/pageContent/PageCenter";
import {useParams} from "react-router";
import testPlanStore from "../../plan/store/testPlanStore";

const TestPlanBindCaseInstanceList = (props) =>{
    const {findTestPlan}  =  testPlanStore

    let {id} = useParams()
    let testPlanId = id

    useEffect(async ()=>{
        if(sessionStorage.getItem("testPlanId") &&  sessionStorage.getItem("projectId")) return

        const planInfo = await findTestPlan(testPlanId)
        if(planInfo){
            sessionStorage.setItem("projectId",planInfo.projectId)
            sessionStorage.setItem("testPlanId",planInfo.id)
        }
    },[testPlanId])


    return(
        <PageCenter>
            <div className={"content-box-center"}>
                <CaseBread
                    router={`/plan/${sessionStorage.getItem("testPlanId")}/instance`}
                    breadItem={["测试历史","历史详情"]}
                />
                <TestPlanBindCaseInstanceTable {...props} />
            </div>
        </PageCenter>
    )
}

export default TestPlanBindCaseInstanceList;