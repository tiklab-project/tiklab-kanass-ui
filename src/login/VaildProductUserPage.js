/*
 * @Descripttion: 用户没有经过产品授权登录的页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import { ExcludeProductUser } from 'tiklab-eam-ui';
import { inject,observer } from "mobx-react";
const VailProductUserPage = (props) => {
    return (
        <ExcludeProductUser {...props}/>
    )
}
export default observer(VailProductUserPage);