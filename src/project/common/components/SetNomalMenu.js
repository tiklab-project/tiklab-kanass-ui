/*
 * @Descripttion: 瀑布式开发开发项目详情页面左侧设置按钮
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { useEffect, useRef, useState } from "react";
import "./setMenu.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
const SetNomalMenu = (props) => {
    const { isShowText } = props;
    const projectId = props.match.params.id;

    /**
     * 跳转到项目设置页面
     */
    const goProjectSetting = () => {
        props.history.push(`/index/projectNomalDetail/${projectId}/projectSetDetail/basicInfo`)
    }


    return (
        <div className="menu-model">
            {
                isShowText ? <div onClick={() => goProjectSetting()}className="project-title setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                :
                <div onClick={() => goProjectSetting()} className = "project-set-icon setting">
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
export default withRouter(SetNomalMenu);