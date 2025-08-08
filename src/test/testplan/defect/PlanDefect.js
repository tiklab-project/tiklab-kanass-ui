import React from "react";
import CaseBindDefectList from "../../defectBind/defect/components/CaseBindDefectList"

const PlanDefect = (props) => {

    const testPlanId = sessionStorage.getItem('testPlanId')

    return (
        // <PageCenter>
        //     <div className={"content-box-center"}>
        //         <div className={"header-box-space-between"}>
        //             <div className={'header-box-title'}>缺陷</div>
        //         </div>
                <CaseBindDefectList
                    isPlanDefect={true}
                    testPlanId={testPlanId}
                    {...props}
                />
        //     </div>
        // </PageCenter>
    )
}

export default PlanDefect;