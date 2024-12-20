/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:08:20
 * @Description: 动态列表
 */

import React from "react";
import "./DyncmicList.scss";
import DyncmicTimeAxis from "../../project/overview/components/DyncmicTimeAxis";
import { observer } from "mobx-react";
import ProjectEmpty from "../component/ProjectEmpty";
const DyncmicList = (props) => {
    const {logList, goDynamicList} = props;
    return (
        <div className="dynamic-box">
        <div className="box-title">
            <div className="name">最新动态</div>
            <div className="more" onClick={() => goDynamicList()}>
                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-rightjump"></use>
                </svg>
            </div>

        </div>
        <div className="dynamic-list">
            {
                logList.length > 0 ?  <DyncmicTimeAxis logList={logList} />
                    :
                    <ProjectEmpty description="暂时没有动态~" />
            }
        </div>
    </div>
    )
}

export default observer(DyncmicList);