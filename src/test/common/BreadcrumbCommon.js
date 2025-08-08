import React from "react";
import IconCommon from "../../common/IconCommon";
import {useHistory} from "react-router";

export const DrawerCloseIcon = () =>{
    let history = useHistory()
    return(
        <IconCommon
            className={"icon-s edit-icon"}
            icon={"shanchu2"}
            // onClick={()=>history.push("/project/testcase")}
        />
    )
}
