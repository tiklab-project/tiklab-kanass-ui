/*
 * @Descripttion: 报表显示判断
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 11:32:17
 */

import React, {Fragment} from "react";
import { inject, observer } from "mobx-react";
import ProjectOperateTable from "./ProjectOperateTable";
import NewWorkItemTrend from "./NewWorkItemTrend";
import EndWorkItemTrend from "./EndWorkItemTrend";
import ProjectSetMember from "./ProjectSetMember";
import ProjectSetWorkItem from "./ProjectSetWorkItem";
import WorkItemStatusSituation from "./WorkItemStatusSituation";
import WorkItemTrend from "./WorkItemTrend";
import UserWorkItem from "./UserWorkItem";
import "./Report.scss"
const ReportItem = (props) => {
    // 表单类型
    const {reportType } = props;
    
    return (
        <Fragment>
            {
                (()=> {
                    switch(reportType) {
                        case "projectOperate": 
                            return <ProjectOperateTable {...props} />
                        case "newTrend":
                            return <NewWorkItemTrend {...props} />
                        case "endTrend": 
                            return <EndWorkItemTrend {...props} />
                        case "projectUser":
                            return <ProjectSetMember {...props} />
                        case "projectWork": 
                            return <ProjectSetWorkItem {...props} />
                        case "workSitustion":
                            return <WorkItemStatusSituation {...props} />
                        case "workTrend":
                            return <WorkItemTrend {...props} />
                        case "userWork":
                            return <UserWorkItem {...props} />
                        default: 
                            break
                    }
                })()
            }
        </Fragment>
    )
}

export default inject("insightStore")(observer(ReportItem));