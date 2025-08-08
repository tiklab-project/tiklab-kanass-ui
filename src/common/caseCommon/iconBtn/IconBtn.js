import React from "react";
import "./iconBtnStyle.scss"
import {Button} from "antd";

/**
 * 按钮 可带icon
 */
const IconBtn = (props) =>{
    const {name,className,onClick,icon,type} = props;

    return(
        <div className={"pi-icon-btn-box"}>
            <Button type={type} className={`${className}`} style={{padding:"4px 10px"}} onClick={onClick}>
                <div className={`pi-icon-btn`} >
                    {
                        icon
                            ?<svg className={"icon-s"} aria-hidden="true">
                                <use xlinkHref= {`#icon-${icon}`} />
                            </svg>
                            :null
                    }

                    <span style={{margin:"0 0 0 5px"}}>{name}</span>
                </div>
            </Button>

        </div>

    )
}

export default IconBtn;