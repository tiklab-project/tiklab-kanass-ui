import React, {useState} from "react";
import "./MilestoneAside.scss";
//import "../../../assets/font-icon/iconfont";

const MilestoneAside = () => {
    const [menuType, setMenuType] = useState("pending");
    const selectMenu = (type) => {
        setMenuType(type)
    }
    return (
        <div className="milestone-aside">
            <div className="milestone-aside-title">
                <span>里程碑</span>
                <span>

                </span>
            </div>
            <div className={`milestone-aside-item ${menuType === "pending" ? "milestone-aside-focus" : ""}`} onClick={() => selectMenu("pending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-process"></use>
                </svg>
                我的待办
            </div>
            <div className={`milestone-aside-item ${menuType === "ending" ? "milestone-aside-focus" : ""}`} onClick={() => selectMenu("ending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-end"></use>
                </svg>
                我的已办
            </div>
            <div className={`milestone-aside-item ${menuType === "creat" ? "milestone-aside-focus" : ""}`} onClick={() => selectMenu("creat")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programbuild"></use>
                </svg>
                我创建的
            </div>
            <div className={`milestone-aside-item ${menuType === "focus" ? "milestone-aside-focus" : ""}`} onClick={() => selectMenu("focus")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programconcern"></use>
                </svg>
                我关注的
            </div>
            <div className={`milestone-aside-item ${menuType === "recently" ? "milestone-aside-focus" : ""}`} onClick={() => selectMenu("recently")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programrencent"></use>
                </svg>
                最近访问
            </div>
        </div>
    )
}
export default MilestoneAside;