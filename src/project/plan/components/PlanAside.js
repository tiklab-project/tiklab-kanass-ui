/*
 * @Descripttion: 计划添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 15:27:15
 */
import React, {useState} from "react";
import "./PlanAside.scss";

const PlanAside = () => {
    const [menuType, setMenuType] = useState("pending");
    const selectMenu = (type) => {
        setMenuType(type)
    }
    return (
        <div className="plan-aside">
            <div className="plan-aside-title">
                <span>计划</span>
                <span>

                </span>
            </div>
            <div className={`plan-aside-item ${menuType === "pending" ? "plan-aside-focus" : ""}`} onClick={() => selectMenu("pending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-process"></use>
                </svg>
                我的待办
            </div>
            <div className={`plan-aside-item ${menuType === "ending" ? "plan-aside-focus" : ""}`} onClick={() => selectMenu("ending")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-end"></use>
                </svg>
                我的已办
            </div>
            <div className={`plan-aside-item ${menuType === "creat" ? "plan-aside-focus" : ""}`} onClick={() => selectMenu("creat")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programbuild"></use>
                </svg>
                我创建的
            </div>
            <div className={`plan-aside-item ${menuType === "focus" ? "plan-aside-focus" : ""}`} onClick={() => selectMenu("focus")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programconcern"></use>
                </svg>
                我关注的
            </div>
            <div className={`plan-aside-item ${menuType === "recently" ? "plan-aside-focus" : ""}`} onClick={() => selectMenu("recently")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programrencent"></use>
                </svg>
                最近访问
            </div>
        </div>
    )
}
export default PlanAside;