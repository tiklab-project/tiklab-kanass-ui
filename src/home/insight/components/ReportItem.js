import React, {Fragment} from "react";
import { inject, observer } from "mobx-react";
import ProjectOperateTable from "./ProjectOperateTable";
import NewWorkItemTrend from "./NewWorkItemTrend";
import EndWorkItemTrend from "./endWorkItemTrend";
import ProjectSetMember from "./ProjectSetMember";
import ProjectSetWorkItem from "./ProjectSetWorkItem";
import WorkItemStatusSituation from "./WorkItemStatusSituation";
import WorkItemTrend from "./WorkItemTrend";
import UserWorkItem from "./UserWorkItem";
import "./Report.scss"
const ReportItem = (props) => {
    const {reportType, index, condition} = props;
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