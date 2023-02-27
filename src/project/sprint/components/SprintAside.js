import { getUser } from "tiklab-core-ui";
import { inject, observer } from "mobx-react";
import React, {useState} from "react";
import "./sprintAside.scss";

const SprintAside = (props) => {
    const {sprintStore}  = props;
    const { findSprintList,setFilterType, sprintlist,findFocusSprintList } = sprintStore;
    const [menuType, setMenuType] = useState("pending");
    const projectId = props.match.params.id;
    const masterId = getUser().userId;
    const selectMenu = (type) => {
        setMenuType(type)
        setFilterType(type)
        switch(type){
            case "pending":
                findSprintList({ projectId: projectId, sprintStateId: "111111"});
                break;
            case "creating":
                findSprintList({ projectId: projectId, sprintStateId: "000000"});
                break;
            case "ending":
                findSprintList({ projectId: projectId, sprintStateId: "222222"});
                break;
            case "all":
                findSprintList({ projectId: projectId, sprintStateId: null});
                break;
            case "focus":
                findFocusSprintList({ projectId: projectId, master: masterId});
                break;

            default:
                break;
        }
    }

    return (
        <div className="sprint-aside">
            <div className="sprint-aside-title">
                <span>迭代</span>
                <span>

                </span>
            </div>
            <div className={`sprint-aside-item ${menuType === "pending" ? "sprint-aside-focus" : ""}`} onClick={() => selectMenu("pending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-process"></use>
                </svg>
                进行中的迭代
            </div>
            <div className={`sprint-aside-item ${menuType === "creating" ? "sprint-aside-focus" : ""}`} onClick={() => selectMenu("creating")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-nobegin"></use>
                </svg>
                未开始的迭代
            </div>
           
           
            <div className={`sprint-aside-item ${menuType === "all" ? "sprint-aside-focus" : ""}`} onClick={() => selectMenu("all")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-log"></use>
                </svg>
                全部迭代
            </div> 
            <div className={`sprint-aside-item ${menuType === "ending" ? "sprint-aside-focus" : ""}`} onClick={() => selectMenu("ending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-end"></use>
                </svg>
                已完成的迭代
            </div>
            <div className={`sprint-aside-item ${menuType === "focus" ? "sprint-aside-focus" : ""}`} onClick={() => selectMenu("focus")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programconcern"></use>
                </svg>
                我关注的迭代
            </div>
        </div>
    )
}
export default inject("sprintStore")(observer(SprintAside));