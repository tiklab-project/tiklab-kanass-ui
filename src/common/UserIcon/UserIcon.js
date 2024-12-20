/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:23:25
 * @Description: 成员头像
 */
import React from "react";
import "./UserIcon.scss"
const UserIcon = (props) => {
    const {name, size} = props;
    const showName = name? name.charAt(0) : "A";
    return (
        <div className={size === "big" ? "user-big-icon" : "user-icon"} >
            {showName}
        </div>
    )
}

export default UserIcon;