import React, { Fragment, useEffect,useState } from "react";
import { PrivilegeProjectRole } from 'doublekit-privilege-ui';

const ProjectRole = props => {
    console.log(props)

    return (
        <div className="test">
            <PrivilegeProjectRole
                group={'system'}
                {...props}
            />
        </div>
    )
}

export default ProjectRole;