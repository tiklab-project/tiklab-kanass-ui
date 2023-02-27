import React, { Fragment, useEffect,useState } from "react";
import { SystemRoleList } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";
const SystemRoleWrap = props => {


    return (
            <SystemRoleList
                {...props}
                bgroup={'teamwire'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));