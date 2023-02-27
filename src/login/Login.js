/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import {Login} from 'tiklab-eam-ui'
import logo from "../assets/images/logo.png";

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