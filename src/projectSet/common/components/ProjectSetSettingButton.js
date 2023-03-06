/*
 * @Descripttion: 项目集设置菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { useEffect, useRef, useState } from "react";
import "./projectSetSettingButton.scss";
import { withRouter } from "react-router";

const ProjectSetSettingButton = (props) => {
    // 当前显示样式，宽，窄
    const { isShowText } = props;
    // 设置按钮
    const setButton = useRef()
    // 项目集id
    const projectSetId = props.match.params.projectSetId;
    // 
    const goProjectSetSetting = () => {
        props.history.push(`/index/projectSetdetail/${projectSetId}/projectSetset/basicInfo`)
    }


   

    return (
        <div className="menu-model">
            {
                isShowText ? <div onClick={() => goProjectSetSet()} ref={setButton} className="project-title setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                :
                <div onClick={() => goProjectSetSetting()} ref={setButton} className = "project-set-icon setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
            }
        </div>
    )
}
export default withRouter(ProjectSetSettingButton);