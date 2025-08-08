import React from "react";
import { Provider } from 'mobx-react';
import CategoryStore from "../../category/store/CategoryStore";
import FuncUnitStore from "../../function/store/funcUnitStore";
import testPlanStore from "../plan/store/testPlanStore";
// import WorkItemStore from "../../integrated/teamwire/workItem/store/WorkItemStore";
import "../plan/components/testPlanStyle.scss"
import PlanDetailMenu from "./PlanDetailMenu";
import testcaseStore from "../../testcase/store/testcaseStore";
import "../../common/styles/base.scss"


const PlanDetailContent = (props) =>{
    let stores = {
        categoryStore: CategoryStore,
        funcUnitStore:FuncUnitStore,
        testPlanStore:testPlanStore,
        testcaseStore:testcaseStore

        // workItemStore:WorkItemStore,
    }

    return(
        <Provider {...stores}>
            <PlanDetailMenu {...props}/>
        </Provider>
    )
}
export default PlanDetailContent