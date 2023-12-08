import React, { Fragment, useEffect,useState } from "react";
import { SystemRole } from 'thoughtware-privilege-ui';
import { inject, observer } from "mobx-react";
const SystemRoleWrap = props => {


    return (
            <SystemRole
                {...props}
                bgroup={'kanass'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));