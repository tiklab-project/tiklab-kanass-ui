/*
 * @Author: 袁婕轩
 * @Date: 2024-08-07 15:18:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:43:02
 * @Description: 迭代，项目集，计划，版本的icon
 */

import React from "react";
import "./ColorIcon.scss"
const ColorIcon = (props) => {
    const {color, name, className} = props;
    return (
        <div className={`color-icon color-icon-${color} ${className}`}>{name?.slice(0, 1)}</div>
    )
}

export default ColorIcon;