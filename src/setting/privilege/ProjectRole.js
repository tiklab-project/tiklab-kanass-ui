import React from "react";
import { ProjectRole } from 'tiklab-user-ui';
import { inject, observer } from "mobx-react";

const ProjectRoleList = props => {
    

    return (
        // <div className="test">
            < ProjectRole
                bgroup={'teamwire'}
                isBase = {true}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectRoleList));