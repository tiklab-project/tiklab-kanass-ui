/*
 * @Descripttion: 用户没有经过产品授权登录的页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 10:41:38
 */
import React from "react";
import { NotFound } from "thoughtware-eam-ui";
const NoFoundPage = (props) => {
    return (
        <NotFound
            {...props}
            homePath={'/index/overview'}  //传返回的页面路由参数
        />
    )
}
export default NoFoundPage;