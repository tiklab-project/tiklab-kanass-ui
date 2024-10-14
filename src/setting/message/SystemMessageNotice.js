import React from "react";
import {MessageNotice} from 'tiklab-message-ui';

const SystemMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'kanass'} isBase={false}/>
    )
}
export default SystemMessageNotice;