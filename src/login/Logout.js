import React from "react";
import {Logout} from 'tiklab-eam-ui';
import { inject,observer } from "mobx-react";
const ProjectLogout = (props) => {
    return (
        <Logout {...props}/>
    )
}
export default inject("eamStore")(observer(ProjectLogout));