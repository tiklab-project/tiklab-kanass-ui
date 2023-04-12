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