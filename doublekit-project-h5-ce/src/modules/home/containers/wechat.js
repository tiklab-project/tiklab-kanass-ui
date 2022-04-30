import { ProjectWechatCE } from "doublekit-portal-h5";
import React from "react";
import { inject,observer } from "mobx-react";
const Wechat = (props) => {

    return(
        <ProjectWechatCE 
            {...props}
            corpid = {"ww29642f6060791291"}
            corpsecret = {"L-TbZ_ESpsee2OnYbKCqI8dLBlZ4FbCSy1sgB4E2TNU"}
        />
    )
}
export default Wechat;
