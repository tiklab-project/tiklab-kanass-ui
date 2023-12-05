/*
 * @Descripttion: 敏捷开发项目详情页面左侧设置按钮
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { useEffect, useRef, useState } from "react";
import "./setMenu.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";

const SetScrumMenu = (props) => {
    const { isShowText} = props;
    const setButton = useRef()
    const { t } = useTranslation();
    const projectId = props.match.params.id;

     /**
     * 跳转到项目设置页面
     */
    const goProjectSetting = () => {
        props.history.push(`/projectDetail/${projectId}/projectSetDetail/basicInfo`)
    }

    return (
        <div className="menu-model">
            {
                isShowText ? <div onClick={() => goProjectSetting()} ref={setButton} className="project-set-title setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                :
                <div onClick={() => goProjectSetting()} ref={setButton} className = "project-set-icon setting">
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
export default withRouter(SetScrumMenu);