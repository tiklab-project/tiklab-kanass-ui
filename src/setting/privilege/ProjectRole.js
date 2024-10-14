import React from "react";
import { ProjectRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

const ProjectRoleList = props => {
    

    return (
        // <div className="test">
            < ProjectRole
                bgroup={'kanass'}
                isBase = {true}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectRoleList));