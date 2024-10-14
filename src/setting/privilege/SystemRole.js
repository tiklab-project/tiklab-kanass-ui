import React, { Fragment, useEffect,useState } from "react";
import { SystemRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";
const SystemRoleWrap = props => {


    return (
            <SystemRole
                {...props}
                isBase = {true}
                bgroup={'kanass'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));