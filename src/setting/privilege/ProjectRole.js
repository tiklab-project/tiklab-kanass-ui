import React, { Fragment, useEffect,useState } from "react";
import { ProjectRoleList } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

const ProjectRole = props => {
    

    return (
        // <div className="test">
            < ProjectRoleList
                bgroup={'teamwire'}
                isBase = {true}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectRole));