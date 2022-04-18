/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import {ProjectLogin, LOGIN_STATUS} from 'doublekit-portal-ui'
import logo from "../../assets/images/logo.png";
import {observer, inject} from 'mobx-react';

const Login = (props) => {
    return (
        
        <ProjectLogin 
            {...props}
            contentImg={logo}
            loginGoRouter={'/index/home'}
            title = {'项目管理'}
        />
    )
}
export default inject(LOGIN_STATUS)(observer(Login));