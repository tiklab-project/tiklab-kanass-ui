import React from "react";
import {Login} from 'tiklab-eam-ui'
import logo from "../../assets/images/logo.png";

import { inject,observer } from "mobx-react";

const ProjectLogin = (props) => {
    
    return (
        <Login 
            {...props}
            logoImg={logo}
            loginGoRouter={'/index/home/survey'}
            vaildUserAuthRouter = {'/noAuth'}
            title = {'项目管理'}
        />
    )
}
export default inject("eamStore")(observer(ProjectLogin));