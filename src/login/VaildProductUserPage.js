/*
 * @Descripttion: 用户没有经过产品授权登录的页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import { NotFound } from "thoughtware-privilege-ui"
import { inject, observer } from "mobx-react";
const VailProductUserPage = (props) => {
    return (
        <NotFound
            {...props}
            homePath={'/'}
            // 404(页面找不到,默认)，noaccess(没有访问权限)
            type={'404' || 'noaccess'}
        />
    )
}
export default observer(VailProductUserPage);