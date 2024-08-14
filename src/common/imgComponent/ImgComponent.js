
/**
 * 用于静态图片转动态图标直接可以在这个组件修改地址即可
 */
import React from "react";
import setImageUrl from "../utils/setImageUrl";

const ImgComponent = (props) => {
    const {src, alt, className, title, style, isRemote} = props;
    const url =  version === "cloud" ? `/kanass/images/${src}` : `/kanass/images/${src}`
    return (
        <img
            src={isRemote ? setImageUrl(src) : url}
            alt={alt}
            className={className}
            title = {title}
            style = {style}
    />
    )
}

export default ImgComponent;
