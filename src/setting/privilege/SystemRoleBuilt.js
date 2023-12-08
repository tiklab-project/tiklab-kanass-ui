import React, { Fragment, useEffect,useState } from "react";
import { SystemRole } from 'thoughtware-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const SystemRoleBuilt = props => {


    return (
        <SystemRole
            bgroup={'kanass'}
            isBase = {true}
            {...props}
        />
    )
}

export default inject("privilegeSystemStore")(observer(SystemRoleBuilt));