/*
 * @Descripttion: 敏捷开发项目详情页面左侧设置按钮
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:43:13
 */

import React, { useRef } from "react";
import "./setMenu.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";

const SetMenu = (props) => {
    const { isShowText } = props;
    const setButton = useRef()
    const { t } = useTranslation();
    const projectId = props.match.params.id;

    /**
    * 跳转到项目设置页面
    */
    const goProjectSetting = () => {
        props.history.push(`/project/${projectId}/set/basicInfo`)
    }

    return (
        <div className="project-setting" onClick={() => goProjectSetting()}>
            {
                isShowText ? <div ref={setButton} className="project-setting-title setting">
                     <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref="#icon-set"></use>
                        </svg>
                    <span>
                        设置
                    </span>
                </div>
                    :
                    <div ref={setButton} className="project-setting-icon setting">
                        <svg className="icon-18" aria-hidden="true">
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
export default withRouter(SetMenu);