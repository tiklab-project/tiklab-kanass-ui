import React from "react";
import "./ColorIcon.scss"
const ColorIcon = (props) => {
    const {color, name, className} = props;
    return (
        <div className={`color-icon color-icon-${color} ${className}`}>{name?.slice(0, 1)}</div>
    )
}

export default ColorIcon;