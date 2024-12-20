/*
 * @Author: 袁婕轩
 * @Date: 2024-08-07 10:07:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:48:24
 * @Description: 用于静态图片转动态图标直接可以在这个组件修改地址即可
 */

import React from "react";
import setImageUrl from "../utils/setImageUrl";

const ImgComponent = (props) => {
    const {src, alt, className, title, style, isRemote} = props;
    return (
        <img
            src={isRemote ? setImageUrl(src) : `/images/${src}`}
            alt={alt}
            className={className}
            title = {title}
            style = {style}
    />
    )
}

export default ImgComponent;
