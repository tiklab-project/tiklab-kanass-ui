/*
 * @Descripttion: 登录
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import {Login} from 'tiklab-eam-ui'
import logo from "../assets/images/logo.png";


const ProjectLogin = (props) => {
    
    return (
        <Login 
            {...props}
            logoImg={logo}
            loginGoRouter={'/index/overview'}
            vaildUserAuthRouter = {'/noAuth'}
            title = {'项目管理'}
            bgroup={'kanass'}
        />
    )
}
export default ProjectLogin;