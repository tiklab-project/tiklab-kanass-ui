/*
 * @Descripttion: 退出
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import {Logout} from 'tiklab-eam-ui';
import { inject,observer } from "mobx-react";
const ProjectLogout = (props) => {
    return (
        <Logout {...props}/>
    )
}
export default inject("eamStore")(observer(ProjectLogout));