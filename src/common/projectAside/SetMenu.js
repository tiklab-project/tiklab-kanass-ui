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
import { withRouter } from "react-router";

const SetMenu = (props) => {
    const { isShowText, setUrl, theme } = props;
    const setButton = useRef()

    /**
    * 跳转到项目设置页面
    */
    const goProjectSetting = () => {
        props.history.push(setUrl)
    }

    return (
        <div className="project-setting" onClick={() => goProjectSetting()}>
            {
                isShowText ? <div ref={setButton} className="project-setting-title setting">
                    <svg className="icon-18" aria-hidden="true">
                        <use xlinkHref={`${theme === "default" ? "#icon-set" : "#icon-set-white"}`}></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                    :
                    <div ref={setButton} className="project-setting-icon setting">
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`${theme === "default" ? "#icon-set" : "#icon-set-white"}`}></use>
                        </svg>
                        <span>
                            设置
                        </span>
                    </div>
            }
        </div>
    )
}
export default withRouter(SetMenu);