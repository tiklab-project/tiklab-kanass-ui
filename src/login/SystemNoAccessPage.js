/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:41:55
 * @Description: 没有资源访问权限
 */

import React from "react";
import {NoAccess} from "tiklab-privilege-ui";

const SystemNoAccessPage = props =>{
    return (
        <NoAccess
            {...props}
            homePath={'/index/overview'} //传返回的页面路由参数
        />
    )
}

export default SystemNoAccessPage;