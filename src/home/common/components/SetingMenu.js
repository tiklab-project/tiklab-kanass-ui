/*
 * @Author: 袁婕轩
 * @Date: 2024-08-21 09:43:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:00:27
 * @Description: 设置菜单
 */

import React from "react";
import { withRouter } from "react-router";

const SetingMenu = (props) => {
    const {isShowText, theme} = props;
    const goSet = () => {
        if(version === "cloud"){
            props.history.push('/setting/home')
        }else {
            props.history.push('/setting/home')
        }
    }
    return (
        <div>
            {
                isShowText ?
                    <div className="search-text first-menu-text-item" onClick={() => goSet()}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-set-${theme}`} ></use>
                        </svg>
                        <div>设置</div>
                    </div>

                    :
                    <div className="first-menu-link-item" data-title-right="设置" onClick={() => goSet()}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-set-${theme}`} ></use>
                        </svg>
                    </div>

            }
            </div>
    )
}
export default withRouter(SetingMenu);