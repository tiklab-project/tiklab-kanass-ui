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
import { AvatarLink } from "thoughtware-licence-ui";

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
        <div className="project-setting">
            {
                isShowText ? <div  ref={setButton} className="project-setting-title setting">
                    <AvatarLink {...props} />
                    <span>
                        个人中心
                    </span>
                </div>
                :
                <div ref={setButton} className = "project-setting-icon setting">
                    {/* <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg> */}
                    <AvatarLink {...props} />
                    {/* <span>
                        设置
                    </span> */}
                </div>
            }
        </div>
    )
}
export default withRouter(SetScrumMenu);