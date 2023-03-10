import React, { Fragment, useEffect,useState } from "react";
import { SystemRole } from 'tiklab-user-ui';
import { inject, observer } from "mobx-react";
const SystemRoleWrap = props => {


    return (
            <SystemRole
                {...props}
                bgroup={'teamwire'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));